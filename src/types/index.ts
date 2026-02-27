// Core data types for the dashboard

export interface Project {
  project_name: string;
  ticker: string;
  initial_cash: number;
  initial_token: number;
  initial_date: string;
  initial_snapshot_id: string;
}

export interface Snapshot {
  id: string;
  timestamp: string;
  total_value: number;
  spot_pnl_realized: number;
  spot_pnl_unrealized: number;
  perp_pnl_realized: number;
  perp_pnl_unrealized: number;
  margin_used: number;
  margin_available: number;
  margin_total: number;
  cash_value: number;
  token_value: number;
  long_value: number;
  short_value: number;
}

export interface VenueBreakdown {
  venue: string;
  market: string;
  venue_type: 'perp' | 'spot' | 'lp';  // 场所类型：合约/现货/流动性池
  position_value: number;
  share_of_total: number;  // 占总资产比例
  positions_count: number;  // 持仓数量
  
  // 合约专用字段
  mark_price?: number;
  index_price?: number;
  margin_usage?: number;
  long_percent?: number;
  short_percent?: number;
  leverage?: number;
  
  // 现货/LP专用字段
  spot_price?: number;
  qty?: number;  // 代币数量（仅现货）
  liquidity?: number;  // 流动性（仅LP）
}

export interface RoleBreakdown {
  role: 'CEX' | 'LP' | 'MM' | 'LOCK' | 'WHALE' | 'VC';
  value: number;
  share: number;
}

export interface CashAccount {
  account_id: string;
  account_type: string;
  assets: Record<string, {
    balance: number;
    price_usd: number;
    value_usd: number;
  }>;
  total_usd: number;
  share: number;
  delta_24h: number;
  delta_7d: number;
}

export interface SpotWallet {
  wallet: string;
  network: string;
  assets: string[];
  value_usd: number;
  share: number;
  tag: 'Treasury' | 'Team' | 'Strategy';
}

export interface WalletHolding {
  id: string;
  controller: string; // 控制者/所属
  wallet: string; // 钱包地址
  network: string; // 网络
  venue?: string; // 场所/协议（对于外部未控）
  tags: string[]; // 标签数组
  token: string; // 代币符号
  quantity: number; // 代币数量
  usd_value: number; // 美元价值
  share_percent: number; // 占比
  cost_basis?: number; // 成本价
  current_price: number; // 当前价格
  pnl_usd?: number; // PnL (USD)
  pnl_percent?: number; // PnL (%)
  last_updated: string; // 最后更新时间
  added_date: string; // 添加日期
  is_internal: boolean; // 是否为内部控制
  role?: 'CEX' | 'LP' | 'MM' | 'LOCK' | 'WHALE' | 'VC'; // 角色（外部未控时使用）
}

export interface TokenDistribution {
  token: string;
  qty: number;
  value: number;
  share: number;
}

export interface PerpPosition {
  venue: string;
  symbol: string;
  side: 'Long' | 'Short';
  size: number;
  entry: number;
  mark: number;
  liq_price: number;
  pnl_unrealized: number;
  margin: number;
  funding: number;
  risk_level: 'Low' | 'Medium' | 'High';
}

export interface QuadrantData {
  notional: number;
  margin: number;
  leverage: number;
  pnl_unrealized: number;
  delta_24h: number;
  history: number[];
}
