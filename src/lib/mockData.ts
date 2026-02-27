// Mock data for the dashboard
import type { Project, Snapshot, VenueBreakdown, RoleBreakdown, CashAccount, SpotWallet, TokenDistribution, PerpPosition, QuadrantData, WalletHolding } from '../types';

// Projects data
export const projects: Project[] = [
  {
    project_name: 'Alpha Protocol',
    ticker: 'ALPHA',
    initial_cash: 5000000,
    initial_token: 100000000,
    initial_date: '2024-01-15',
    initial_snapshot_id: 'snap_alpha_001',
  },
  {
    project_name: 'Beta Network',
    ticker: 'BETA',
    initial_cash: 8000000,
    initial_token: 150000000,
    initial_date: '2024-03-20',
    initial_snapshot_id: 'snap_beta_001',
  },
  {
    project_name: 'Gamma DAO',
    ticker: 'GAMMA',
    initial_cash: 3000000,
    initial_token: 50000000,
    initial_date: '2024-06-10',
    initial_snapshot_id: 'snap_gamma_001',
  },
];

export const projectData: Project = projects[0];

// Initial snapshots for each project
export const initialSnapshots: Record<string, Snapshot> = {
  ALPHA: {
    id: 'snap_alpha_001',
    timestamp: '2024-01-15T00:00:00Z',
    total_value: 5000000,
    spot_pnl_realized: 0,
    spot_pnl_unrealized: 0,
    perp_pnl_realized: 0,
    perp_pnl_unrealized: 0,
    margin_used: 0,
    margin_available: 0,
    margin_total: 0,
    cash_value: 5000000,
    token_value: 0,
    long_value: 0,
    short_value: 0,
  },
  BETA: {
    id: 'snap_beta_001',
    timestamp: '2024-03-20T00:00:00Z',
    total_value: 8000000,
    spot_pnl_realized: 0,
    spot_pnl_unrealized: 0,
    perp_pnl_realized: 0,
    perp_pnl_unrealized: 0,
    margin_used: 0,
    margin_available: 0,
    margin_total: 0,
    cash_value: 8000000,
    token_value: 0,
    long_value: 0,
    short_value: 0,
  },
  GAMMA: {
    id: 'snap_gamma_001',
    timestamp: '2024-06-10T00:00:00Z',
    total_value: 3000000,
    spot_pnl_realized: 0,
    spot_pnl_unrealized: 0,
    perp_pnl_realized: 0,
    perp_pnl_unrealized: 0,
    margin_used: 0,
    margin_available: 0,
    margin_total: 0,
    cash_value: 3000000,
    token_value: 0,
    long_value: 0,
    short_value: 0,
  },
};

export const initialSnapshot: Snapshot = initialSnapshots.ALPHA;

// Generate minute-by-minute snapshots for the last few hours
// This simulates automatic snapshot saving every minute
function generateMinuteSnapshots(projectId: string, baseValue: number, seed: number): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const now = new Date('2025-10-27T14:30:00Z');
  
  // Generate snapshots for the last 3 hours (180 minutes)
  for (let i = 180; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    const variation = Math.sin((i + seed) / 30) * 2000000 + Math.random() * 500000;
    const totalValue = baseValue + variation;
    
    snapshots.push({
      id: `snap_${projectId}_${timestamp.getTime()}`,
      timestamp: timestamp.toISOString(),
      total_value: totalValue,
      spot_pnl_realized: (3200000 * (baseValue / 45000000)) + Math.random() * 100000 - 50000,
      spot_pnl_unrealized: (1850000 * (baseValue / 45000000)) + Math.random() * 100000 - 50000,
      perp_pnl_realized: (-450000 * (baseValue / 45000000)) + Math.random() * 50000 - 25000,
      perp_pnl_unrealized: (280000 * (baseValue / 45000000)) + Math.random() * 50000 - 25000,
      margin_used: (2500000 * (baseValue / 45000000)) + Math.random() * 100000 - 50000,
      margin_available: (1500000 * (baseValue / 45000000)) + Math.random() * 100000 - 50000,
      margin_total: (4000000 * (baseValue / 45000000)) + Math.random() * 100000 - 50000,
      cash_value: (12500000 * (baseValue / 45000000)) + Math.random() * 500000 - 250000,
      token_value: totalValue - ((12500000 * (baseValue / 45000000)) + Math.random() * 500000 - 250000),
      long_value: (28500000 * (baseValue / 45000000)) + Math.random() * 500000 - 250000,
      short_value: (15200000 * (baseValue / 45000000)) + Math.random() * 300000 - 150000,
    });
  }
  
  return snapshots;
}

// Auto-generated snapshots for each project (every minute for the last 3 hours)
export const savedSnapshotsByProject: Record<string, Snapshot[]> = {
  ALPHA: generateMinuteSnapshots('alpha', 45000000, 0),
  BETA: generateMinuteSnapshots('beta', 62000000, 30),
  GAMMA: generateMinuteSnapshots('gamma', 28000000, 60),
};

export const savedSnapshots: Snapshot[] = savedSnapshotsByProject.ALPHA;

// Current snapshots for each project (latest one)
export const currentSnapshots: Record<string, Snapshot> = {
  ALPHA: savedSnapshotsByProject.ALPHA[savedSnapshotsByProject.ALPHA.length - 1],
  BETA: savedSnapshotsByProject.BETA[savedSnapshotsByProject.BETA.length - 1],
  GAMMA: savedSnapshotsByProject.GAMMA[savedSnapshotsByProject.GAMMA.length - 1],
};

export const currentSnapshot: Snapshot = currentSnapshots.ALPHA;

export const venueBreakdown: VenueBreakdown[] = [
  // 合约场所
  { 
    venue: 'Binance Futures', 
    market: 'ALPHA-PERP', 
    venue_type: 'perp',
    mark_price: 0.456, 
    index_price: 0.455, 
    position_value: 18500000, 
    share_of_total: 41.1,
    margin_usage: 950000, 
    leverage: 19.5,
    long_percent: 65, 
    short_percent: 35, 
    positions_count: 8 
  },
  { 
    venue: 'Bybit', 
    market: 'ALPHA-PERP', 
    venue_type: 'perp',
    mark_price: 0.457, 
    index_price: 0.455, 
    position_value: 12300000, 
    share_of_total: 27.3,
    margin_usage: 680000, 
    leverage: 18.1,
    long_percent: 48, 
    short_percent: 52, 
    positions_count: 5 
  },
  
  // 流动性池
  { 
    venue: 'Uniswap V3', 
    market: 'ALPHA/ETH', 
    venue_type: 'lp',
    spot_price: 0.455, 
    position_value: 8900000, 
    share_of_total: 19.8,
    liquidity: 8900000,
    qty: 19560440,
    positions_count: 3  // LP池数量
  },
  
  // 现货场所
  { 
    venue: 'Binance Spot', 
    market: 'ALPHA/USDT', 
    venue_type: 'spot',
    spot_price: 0.454, 
    position_value: 3680000, 
    share_of_total: 8.2,
    qty: 8105726,
    positions_count: 2  // 账户数量
  },
  { 
    venue: 'Gate.io', 
    market: 'ALPHA/USDT', 
    venue_type: 'spot',
    spot_price: 0.453, 
    position_value: 1620000, 
    share_of_total: 3.6,
    qty: 3576159,
    positions_count: 1
  },
];

export const roleBreakdown: RoleBreakdown[] = [
  { role: 'CEX', value: 8500000, share: 25.6 },
  { role: 'LP', value: 12300000, share: 37.1 },
  { role: 'MM', value: 4200000, share: 12.7 },
  { role: 'LOCK', value: 3800000, share: 11.5 },
  { role: 'WHALE', value: 2900000, share: 8.7 },
  { role: 'VC', value: 1480000, share: 4.4 },
];

export const cashAccounts: CashAccount[] = [
  {
    account_id: 'binance_main',
    account_type: 'CEX',
    assets: {
      USDT: { balance: 3500000, price_usd: 1.0, value_usd: 3500000 },
      USDC: { balance: 1200000, price_usd: 1.0, value_usd: 1200000 },
      BNB: { balance: 2500, price_usd: 620, value_usd: 1550000 },
    },
    total_usd: 6250000,
    share: 50.0,
    delta_24h: 2.3,
    delta_7d: 5.8,
  },
  {
    account_id: 'bybit_trading',
    account_type: 'CEX',
    assets: {
      USDT: { balance: 2100000, price_usd: 1.0, value_usd: 2100000 },
      ETH: { balance: 450, price_usd: 3200, value_usd: 1440000 },
    },
    total_usd: 3540000,
    share: 28.3,
    delta_24h: -1.2,
    delta_7d: 3.4,
  },
  {
    account_id: '0x742d...3f8a',
    account_type: 'Wallet',
    assets: {
      USDC: { balance: 1800000, price_usd: 1.0, value_usd: 1800000 },
      DAI: { balance: 520000, price_usd: 1.0, value_usd: 520000 },
    },
    total_usd: 2320000,
    share: 18.6,
    delta_24h: 0.5,
    delta_7d: 1.2,
  },
  {
    account_id: 'gate_backup',
    account_type: 'CEX',
    assets: {
      USDT: { balance: 390000, price_usd: 1.0, value_usd: 390000 },
    },
    total_usd: 390000,
    share: 3.1,
    delta_24h: 0.0,
    delta_7d: 0.0,
  },
];

export const spotWalletsInternal: SpotWallet[] = [
  { wallet: '0x1a2b...4c5d', network: 'Ethereum', assets: ['ALPHA', 'ETH'], value_usd: 12500000, share: 52.3, tag: 'Treasury' },
  { wallet: '0x9e8f...1a2b', network: 'BSC', assets: ['ALPHA', 'BNB'], value_usd: 7300000, share: 30.5, tag: 'Strategy' },
  { wallet: '0x3c4d...7e8f', network: 'Ethereum', assets: ['ALPHA'], value_usd: 4100000, share: 17.2, tag: 'Team' },
];

export const tokenDistribution: TokenDistribution[] = [
  { token: 'ALPHA', qty: 68000000, value: 30940000, share: 93.2 },
  { token: 'ETH', qty: 450, value: 1440000, share: 4.3 },
  { token: 'BNB', qty: 2500, value: 1550000, share: 4.7 },
];

export const perpPositions: PerpPosition[] = [
  { venue: 'Binance', symbol: 'BTC-PERP', side: 'Long', size: 150, entry: 62000, mark: 67500, liq_price: 48000, pnl_unrealized: 825000, margin: 1200000, funding: -2300, risk_level: 'Low' },
  { venue: 'Bybit', symbol: 'ETH-PERP', side: 'Short', size: 800, entry: 3500, mark: 3200, liq_price: 4200, pnl_unrealized: 240000, margin: 450000, funding: 1800, risk_level: 'Medium' },
  { venue: 'Binance', symbol: 'ALPHA-PERP', side: 'Long', size: 25000000, entry: 0.42, mark: 0.456, liq_price: 0.32, pnl_unrealized: 900000, margin: 680000, funding: -5600, risk_level: 'High' },
  { venue: 'Gate.io', symbol: 'SOL-PERP', side: 'Short', size: 5000, entry: 185, mark: 172, liq_price: 225, pnl_unrealized: 65000, margin: 170000, funding: 890, risk_level: 'Low' },
];

export const quadrantData = {
  internal_long: {
    notional: 18500000,
    margin: 1200000,
    leverage: 15.4,
    pnl_unrealized: 1250000,
    delta_24h: 3.2,
    history: [17200000, 17800000, 18100000, 17900000, 18300000, 18500000, 18500000],
  } as QuadrantData,
  internal_short: {
    notional: 8200000,
    margin: 580000,
    leverage: 14.1,
    pnl_unrealized: -180000,
    delta_24h: -1.5,
    history: [8500000, 8400000, 8300000, 8200000, 8100000, 8200000, 8200000],
  } as QuadrantData,
  external_long: {
    notional: 10000000,
    margin: 720000,
    leverage: 13.9,
    pnl_unrealized: 420000,
    delta_24h: 5.8,
    history: [9200000, 9400000, 9600000, 9800000, 9900000, 10000000, 10000000],
  } as QuadrantData,
  external_short: {
    notional: 7000000,
    margin: 500000,
    leverage: 14.0,
    pnl_unrealized: -210000,
    delta_24h: 2.1,
    history: [6800000, 6850000, 6900000, 6950000, 7000000, 7000000, 7000000],
  } as QuadrantData,
};

// Detailed wallet holdings data
export const walletHoldingsInternal: WalletHolding[] = [
  {
    id: 'wh_001',
    controller: 'Ethereum',
    wallet: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    network: 'Ethereum',
    tags: ['Treasury', 'Staking'],
    token: 'ALPHA',
    quantity: 45000000,
    usd_value: 20520000,
    share_percent: 52.3,
    cost_basis: 0.42,
    current_price: 0.456,
    pnl_usd: 1620000,
    pnl_percent: 8.57,
    last_updated: '2025-10-28T14:30:00Z',
    added_date: '2024-01-15T00:00:00Z',
    is_internal: true,
  },
  {
    id: 'wh_002',
    controller: 'Ethereum',
    wallet: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    network: 'Ethereum',
    tags: ['Treasury'],
    token: 'ETH',
    quantity: 2500,
    usd_value: 8000000,
    share_percent: 20.4,
    cost_basis: 3100,
    current_price: 3200,
    pnl_usd: 250000,
    pnl_percent: 3.23,
    last_updated: '2025-10-28T14:28:00Z',
    added_date: '2024-01-15T00:00:00Z',
    is_internal: true,
  },
  {
    id: 'wh_003',
    controller: 'BSC',
    wallet: '0x9e8f7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
    network: 'BSC',
    tags: ['Strategy', 'LP Provider'],
    token: 'ALPHA',
    quantity: 15000000,
    usd_value: 6840000,
    share_percent: 17.4,
    cost_basis: 0.44,
    current_price: 0.456,
    pnl_usd: 240000,
    pnl_percent: 3.64,
    last_updated: '2025-10-28T14:25:00Z',
    added_date: '2024-02-10T00:00:00Z',
    is_internal: true,
  },
  {
    id: 'wh_004',
    controller: 'BSC',
    wallet: '0x9e8f7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
    network: 'BSC',
    tags: ['Strategy'],
    token: 'BNB',
    quantity: 1200,
    usd_value: 720000,
    share_percent: 1.8,
    cost_basis: 580,
    current_price: 600,
    pnl_usd: 24000,
    pnl_percent: 3.45,
    last_updated: '2025-10-28T14:20:00Z',
    added_date: '2024-02-10T00:00:00Z',
    is_internal: true,
  },
  {
    id: 'wh_005',
    controller: 'Arbitrum',
    wallet: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
    network: 'Arbitrum',
    tags: ['Team', 'Vesting'],
    token: 'ALPHA',
    quantity: 8000000,
    usd_value: 3648000,
    share_percent: 9.3,
    cost_basis: 0.40,
    current_price: 0.456,
    pnl_usd: 448000,
    pnl_percent: 14.0,
    last_updated: '2025-10-28T14:15:00Z',
    added_date: '2024-03-20T00:00:00Z',
    is_internal: true,
  },
];

export const walletHoldingsExternal: WalletHolding[] = [
  {
    id: 'wh_ext_001',
    controller: 'Binance',
    wallet: '0xb1n2a3n4c5e6w7a8l9l0e1t2a3d4d5r6e7s8s9a0',
    network: 'Ethereum',
    venue: 'Binance CEX',
    tags: ['Hot Wallet'],
    role: 'CEX',
    token: 'ALPHA',
    quantity: 12000000,
    usd_value: 5472000,
    share_percent: 16.5,
    current_price: 0.456,
    pnl_percent: -2.5,
    pnl_usd: -140000,
    last_updated: '2025-10-28T14:32:00Z',
    added_date: '2024-04-01T00:00:00Z',
    is_internal: false,
  },
  {
    id: 'wh_ext_002',
    controller: 'Uniswap V3',
    wallet: '0xu3n4i5s6w7a8p9l0p1r2o3v4i5d6e7r8a9d0d1r',
    network: 'Ethereum',
    venue: 'Uniswap V3',
    tags: ['ALPHA-ETH Pool'],
    role: 'LP',
    token: 'ALPHA',
    quantity: 8500000,
    usd_value: 3876000,
    share_percent: 11.7,
    current_price: 0.456,
    pnl_percent: 5.8,
    pnl_usd: 212000,
    last_updated: '2025-10-28T14:30:00Z',
    added_date: '2024-05-15T00:00:00Z',
    is_internal: false,
  },
  {
    id: 'wh_ext_003',
    controller: 'Wintermute',
    wallet: '0xw1i2n3t4e5r6m7u8t9e0m1m2w3a4l5l6e7t8a9d',
    network: 'Ethereum',
    venue: 'Market Maker',
    tags: ['MM Contract'],
    role: 'MM',
    token: 'ALPHA',
    quantity: 6000000,
    usd_value: 2736000,
    share_percent: 8.3,
    current_price: 0.456,
    pnl_percent: 1.2,
    pnl_usd: 32400,
    last_updated: '2025-10-28T14:28:00Z',
    added_date: '2024-06-01T00:00:00Z',
    is_internal: false,
  },
  {
    id: 'wh_ext_004',
    controller: 'Team Vesting',
    wallet: '0xt1e2a3m4v5e6s7t8i9n0g1c2o3n4t5r6a7c8t9a',
    network: 'Ethereum',
    venue: 'Sablier Vesting',
    tags: ['6-month cliff', '24-month linear'],
    role: 'LOCK',
    token: 'ALPHA',
    quantity: 10000000,
    usd_value: 4560000,
    share_percent: 13.8,
    current_price: 0.456,
    pnl_percent: 0,
    last_updated: '2025-10-28T14:25:00Z',
    added_date: '2024-01-15T00:00:00Z',
    is_internal: false,
  },
  {
    id: 'wh_ext_005',
    controller: '0x7a8b...9c0d',
    wallet: '0x7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t',
    network: 'Ethereum',
    tags: ['Whale Address'],
    role: 'WHALE',
    token: 'ALPHA',
    quantity: 5000000,
    usd_value: 2280000,
    share_percent: 6.9,
    current_price: 0.456,
    pnl_percent: 12.5,
    pnl_usd: 253000,
    last_updated: '2025-10-28T14:20:00Z',
    added_date: '2024-07-10T00:00:00Z',
    is_internal: false,
  },
  {
    id: 'wh_ext_006',
    controller: 'Pantera Capital',
    wallet: '0xp1a2n3t4e5r6a7v8c9f0u1n2d3a4d5d6r7e8s9s',
    network: 'Ethereum',
    tags: ['VC Investment', '12-month lock'],
    role: 'VC',
    token: 'ALPHA',
    quantity: 7500000,
    usd_value: 3420000,
    share_percent: 10.3,
    current_price: 0.456,
    pnl_percent: 14.0,
    pnl_usd: 420000,
    last_updated: '2025-10-28T14:18:00Z',
    added_date: '2024-01-15T00:00:00Z',
    is_internal: false,
  },
];
