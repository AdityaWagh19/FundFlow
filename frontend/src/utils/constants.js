export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
export const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

// Default contract address (Sepolia deployed contract)
export const DEFAULT_CONTRACT_ADDRESS = "0xa96C6Da4CDDdE292918efCdA174F933BaBE918fa";

export const CATEGORIES = [
  { id: 0, name: "Medical", color: "#3B82F6", badgeBg: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: 1, name: "Education", color: "#10B981", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: 2, name: "Disaster", color: "#F59E0B", badgeBg: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: 3, name: "Food", color: "#EC4899", badgeBg: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: 4, name: "Community", color: "#8B5CF6", badgeBg: "bg-purple-50 text-purple-700 border-purple-200" },
];

export const INITIAL_FEATURED_CAMPAIGN = {
  id: 1,
  title: "Save our students with your Donation!",
  description: "Help underprivileged university students continue their higher education through crisis grants.",
  targetAmount: "8.5",
  amountCollected: "6.2",
  image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  category: 1,
};

export const INITIAL_CAMPAIGNS = [
  {
    id: 2,
    title: "Los Angeles Flood Relief",
    description: "Emergency shelter, clean drinking water, and essential survival gear for families displaced by heavy storms.",
    targetAmount: "12.0",
    amountCollected: "10.68", // ~89%
    percent: 89,
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
    category: 2,
    raisedFormatted: "$10,795",
    targetFormatted: "$12,235",
  },
  {
    id: 3,
    title: "Dengue Fever Pediatric Care",
    description: "Urgent pediatric medical supplies, rapid testing kits, and IV therapy for children admitted to intensive care.",
    targetAmount: "4.5",
    amountCollected: "2.115", // ~47%
    percent: 47,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    category: 0,
    raisedFormatted: "$1,426",
    targetFormatted: "$3,674",
  },
  {
    id: 4,
    title: "Road Repair & Bridge Donation",
    description: "Rebuilding critical access bridges and roadway infrastructure for rural schools and clinics.",
    targetAmount: "6.0",
    amountCollected: "3.96", // ~66%
    percent: 66,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80",
    category: 4,
    raisedFormatted: "$1,621",
    targetFormatted: "$2,479",
  },
];

export const INITIAL_DONATIONS = [
  {
    name: "Julio Payne",
    address: "0x782...B41a",
    campaign: "Disaster Relief",
    start: "19 May, 09 AM",
    end: "19 May, 10 AM",
    amount: "0.45 ETH",
    status: "Completed",
    txHash: "0x4b78...91a2",
  },
  {
    name: "Ares Hunter",
    address: "0x91C...A732",
    campaign: "Education Grant",
    start: "21 May, 07 AM",
    end: "21 May, 07 AM",
    amount: "1.20 ETH",
    status: "Completed",
    txHash: "0x82b1...38e4",
  },
  {
    name: "Sarai Rubio",
    address: "0x34E...F190",
    campaign: "Medical Care",
    start: "21 May, 11 AM",
    end: "21 May, 12 AM",
    amount: "0.15 ETH",
    status: "Delayed",
    txHash: "0x12a9...88cc",
  },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    title: "Educational assistance",
    category: "Education",
    amount: "$1,190",
    ethAmount: "0.35 ETH",
    time: "10 mins ago",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    title: "Orphanage Assistance",
    category: "Orphaning donation",
    amount: "$1,050",
    ethAmount: "0.31 ETH",
    time: "45 mins ago",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    title: "Community Center Building",
    category: "Building donation",
    amount: "$1,000",
    ethAmount: "0.29 ETH",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=150&q=80",
  },
];
