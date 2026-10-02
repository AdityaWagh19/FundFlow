// Client-Side Persistent Database for FundFlow (localStorage backed)

const STORAGE_KEYS = {
  DONATIONS: 'fundflow_db_donations',
  WITHDRAWALS: 'fundflow_db_withdrawals',
  CREATED_CAMPAIGNS: 'fundflow_db_created_campaigns',
  ACTIVE_ROLE: 'fundflow_db_active_role', // 'auto' | 'organizer' | 'donor'
};

// --- Donations Ledger ---
export const getStoredDonations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading donations from storage:', e);
    return [];
  }
};

export const storeDonation = (donation) => {
  try {
    const existing = getStoredDonations();
    // Prepend new donation
    const updated = [donation, ...existing.filter((d) => d.txHash !== donation.txHash)];
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error storing donation:', e);
    return [];
  }
};

export const updateStoredDonationStatus = (txHash, status) => {
  try {
    const existing = getStoredDonations();
    const updated = existing.map((d) => (d.txHash === txHash ? { ...d, status } : d));
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error updating donation status:', e);
    return [];
  }
};

// --- Withdrawals Ledger ---
export const getStoredWithdrawals = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading withdrawals from storage:', e);
    return [];
  }
};

export const storeWithdrawal = (withdrawal) => {
  try {
    const existing = getStoredWithdrawals();
    const updated = [withdrawal, ...existing];
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error storing withdrawal:', e);
    return [];
  }
};

// --- Role Switcher (Presentation & Testing Mode) ---
export const getStoredRole = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'auto';
  } catch (e) {
    return 'auto';
  }
};

export const setStoredRole = (role) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  } catch (e) {
    console.error('Error setting role in storage:', e);
  }
};

// --- Locally Created Campaigns Cache ---
export const getStoredCreatedCampaigns = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREATED_CAMPAIGNS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const storeCreatedCampaign = (campaign) => {
  try {
    const existing = getStoredCreatedCampaigns();
    const updated = [campaign, ...existing.filter((c) => c.id !== campaign.id)];
    localStorage.setItem(STORAGE_KEYS.CREATED_CAMPAIGNS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error storing created campaign:', e);
    return [];
  }
};
