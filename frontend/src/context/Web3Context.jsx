import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import { DEFAULT_CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_ID_DECIMAL } from '../utils/constants';

const Web3Context = createContext(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contractAddress, setContractAddress] = useState(DEFAULT_CONTRACT_ADDRESS);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState('0.000');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);

  // Check if saved address exists from hardhat deployment
  useEffect(() => {
    try {
      import('../utils/contractAddress.json')
        .then((module) => {
          if (module.default && module.default.contractAddress) {
            setContractAddress(module.default.contractAddress);
          }
        })
        .catch(() => {});
    } catch (e) {}
  }, []);

  const updateBalance = useCallback(async (currentAccount, currentProvider) => {
    if (!currentProvider) return;
    try {
      if (currentAccount) {
        const rawBalance = await currentProvider.getBalance(currentAccount);
        setBalance(parseFloat(ethers.formatEther(rawBalance)).toFixed(4));
      }
      if (contractAddress) {
        const rawContractBal = await currentProvider.getBalance(contractAddress);
        setContractBalance(parseFloat(ethers.formatEther(rawContractBal)).toFixed(4));
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [contractAddress]);

  // Initialize read-only contract instance and fetch contract balance on mount
  useEffect(() => {
    if (contractAddress && contractABI) {
      try {
        const publicProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
        const readOnlyContract = new ethers.Contract(contractAddress, contractABI, publicProvider);
        setContract((prev) => prev || readOnlyContract);
        setProvider((prev) => prev || publicProvider);

        publicProvider.getBalance(contractAddress).then((bal) => {
          setContractBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
        }).catch(() => {});
      } catch (e) {
        console.log('Public provider initialization error:', e);
      }
    }
  }, [contractAddress]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not detected. Please install MetaMask to interact with the blockchain.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const network = await browserProvider.getNetwork();
      const currentSigner = await browserProvider.getSigner();

      setProvider(browserProvider);
      setSigner(currentSigner);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      await updateBalance(accounts[0], browserProvider);

      // Initialize signer contract instance
      if (contractAddress && contractABI) {
        const contractInstance = new ethers.Contract(contractAddress, contractABI, currentSigner);
        setContract(contractInstance);
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetworkToSepolia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Ethereum Sepolia Testnet',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0.00');
    setSigner(null);
    // Revert to read-only contract
    if (contractAddress && contractABI) {
      const publicProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      setContract(new ethers.Contract(contractAddress, contractABI, publicProvider));
      setProvider(publicProvider);
    }
  };

  // Listen to MetaMask account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (provider) updateBalance(accounts[0], provider);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = (newChainId) => {
        setChainId(parseInt(newChainId, 16));
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [provider, updateBalance]);

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        chainId,
        isConnecting,
        contractAddress,
        contractBalance,
        contract,
        provider,
        signer,
        error,
        connectWallet,
        disconnectWallet,
        switchNetworkToSepolia,
        refreshBalance: () => updateBalance(account, provider),
        isSepolia: chainId === SEPOLIA_CHAIN_ID_DECIMAL,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
