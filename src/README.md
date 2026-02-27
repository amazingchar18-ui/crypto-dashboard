# 加密货币项目管理仪表板 (Crypto Project Dashboard)

## 📋 项目概述

这是一个专为加密货币项目设计的全功能管理仪表板，支持多项目切换、历史快照浏览、资产分类追踪（现金/现货/合约），以及内部控制vs外部未控制的资产分析。系统采用React + TypeScript + Tailwind CSS构建，提供响应式布局和流畅的用户体验。

### 核心业务场景
- **多项目管理**：支持在多个加密货币项目之间快速切换
- **快照系统**：每分钟自动保存资产快照，可回溯查看任意历史时刻的完整数据
- **资产分类**：按现金(Cash)、现货(Spot)、合约(Perp/Futures)分类管理
- **控制权分析**：区分内部控制 vs 外部未控制的资产，追踪各角色（CEX/LP/MM/LOCK/WHALE/VC）分布
- **实时对比**：支持快照间的数值对比和变化追踪（Delta 24h/7d）

---

## 🏗️ 技术栈

- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS v4
- **UI组件库**: Shadcn UI (Radix UI primitives)
- **图标**: Lucide React
- **通知**: Sonner Toast
- **状态管理**: React Hooks (useState)
- **构建工具**: Vite (推测，基于项目结构)

---

## 📁 项目结构

```
/
├── App.tsx                          # 主应用入口（路由、项目切换、快照管理）
├── types/index.ts                   # TypeScript类型定义
├── lib/mockData.ts                  # 模拟数据（项目、快照、账户、钱包等）
├── styles/globals.css               # 全局样式和Tailwind配置
├── components/
│   ├── OverviewPage.tsx            # 概览页面（核心汇总视图）
│   ├── CashPage.tsx                # 现金页面
│   ├── SpotPage.tsx                # 现货页面
│   ├── PerpPage.tsx                # 合约页面
│   ├── KpiCard.tsx                 # KPI指标卡片组件
│   ├── ComparisonBar.tsx           # 双向对比条状图（左右对比）
│   ├── SegmentedComparisonBar.tsx  # 分段互补条状图（内部vs外部+角色分布）
│   ├── AllocationCard.tsx          # 资产分配卡片
│   ├── VenueTable.tsx              # 场所/交易所表格
│   ├── WalletHoldingsTable.tsx     # 钱包持仓明细表格
│   ├── TokenIcon.tsx               # 代币图标组件
│   ├── RoleBadges.tsx              # 角色徽章组件（CEX/LP/MM/LOCK/WHALE/VC）
│   ├── SnapshotBar.tsx             # 快照栏（顶部快照控制面板）
│   ├── SnapshotPicker.tsx          # 快照选择器（下拉选择）
│   ├── InitialSnapshotDialog.tsx   # 初始快照对话框
│   └── ui/                          # Shadcn UI组件库
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── table.tsx
│       └── ... (其他UI组件)
└── guidelines/Guidelines.md         # 设计规范文档
```

---

## 🎯 核心功能清单

### ✅ 已完成功能

#### 1. 项目管理系统
- [x] 多项目数据结构（`projects[]`包含ALPHA、BETA、GAMMA三个项目）
- [x] 项目切换器（Header中的DropdownMenu）
- [x] 项目信息卡片（显示ticker、启动日期、初始资金、初始代币量）
- [x] 切换项目时自动加载对应的快照和数据

#### 2. 快照系统
- [x] 初始快照（Initial Snapshot）：每个项目的起始时间点
- [x] 自动保存快照（模拟：每分钟生成一次）
- [x] 当前快照（Current Snapshot）：最新实时数据
- [x] 快照选择器（SnapshotPicker）：下拉选择历史快照
- [x] 快照栏（SnapshotBar）：显示当前快照时间，支持分享和返回最新
- [x] "初始状态"按钮：快速跳转到项目初始快照
- [x] 快照链接分享功能（复制URL参数）

#### 3. 四大页面
##### 📊 概览页面 (OverviewPage)
- [x] 顶部KPI卡片（总资产、总PnL、现金、现货、合约、内部控制率）
- [x] 资产分配饼图/卡片（现金/现货/合约比例）
- [x] **SegmentedComparisonBar** - 内部vs外部互补条状图
  - 左侧：内部控制资产（绿色渐变）
  - 右侧：外部未控资产（按角色分段显示：CEX/LP/MM/LOCK/WHALE/VC）
  - 角色图例：横向布局，图例在左侧（约1/3宽度），外部标签在右侧
- [x] **ComparisonBar** - 四个对比条状图（现货页、合约页）

##### 💵 现金页面 (CashPage)
- [x] 现金账户列表（按账户类型分类）
- [x] 多币种余额显示（USDT/USDC/BTC/ETH等）
- [x] 账户总值和占比
- [x] 24h/7d变化追踪

##### 🪙 现货页面 (SpotPage)
- [x] 内部钱包列表（Treasury/Team/Strategy标签）
- [x] 外部钱包持仓明细表格（WalletHoldingsTable）
- [x] 按控制者、网络、钱包地址分组
- [x] 代币数量、USD价值、成本价、PnL显示
- [x] **TokenIcon组件集成**（显示代币图标）
- [x] 角色徽章（外部钱包显示CEX/LP/MM等角色）

##### 📈 合约页面 (PerpPage)
- [x] 四个对比条状图：
  - 多/空头比例
  - 已实现/未实现PnL
  - 已用/可用保证金
  - 内部/外部持仓
- [x] 合约持仓列表（场所、标的、方向、规模、入场价、标记价、爆仓价）
- [x] 资金费率、未实现PnL、风险等级显示
- [x] 四象限数据展示（内部多、内部空、外部多、外部空）

#### 4. 核心组件

##### **SegmentedComparisonBar** (互补条状图) 🎨
```typescript
// 用途：展示内部控制 vs 外部未控资产分布，外部部分按角色分段
// 特性：
// - 左侧：内部控制（绿色渐变，单一色块）
// -右侧：外部未控（多色分段，每个角色独立颜色）
// - 横向布局：角色图例在左下方（占约1/3宽度），外部标签在右下方
// - 支持百分比显示、金额格式化、渐变背景
```

##### **ComparisonBar** (双向对比条状图) 📊
```typescript
// 用途：简单左右对比（如多空头、已实现/未实现PnL）
// 特性：
// - 左右两侧对称布局，中间分隔线
// - 支持Delta变化指示（↑↗↘箭头）
// - 支持货币/数字两种格式
// - 渐变背景、百分比显示
```

##### **TokenIcon** (代币图标) 🪙
```typescript
// 用途：显示代币图标（如BTC、ETH、USDT等）
// 特性：
// - 支持多种尺寸（xs/sm/md/lg/xl）
// - 默认头像（token首字母）
// - 可配置边框样式
```

##### **KpiCard** (KPI指标卡片) 📈
```typescript
// 用途：展示关键业绩指标
// 特性：
// - 标题、数值、Delta变化、百分比
// - 颜色编码（正绿负红）
// - 图标支持（传入Lucide React图标）
```

#### 5. 设计系统
- [x] 紧凑化布局（间距优化为3-4单位）
- [x] 数字等宽显示（`tabular-nums`）
- [x] 颜色编码：正值绿色(`text-green-600`)、负值红色(`text-red-600`)
- [x] 200-250ms动效过渡（`transition-all duration-200`）
- [x] 响应式布局（`grid-cols-1 md:grid-cols-4`）
- [x] Hover效果（`hover:shadow-lg`）

---

## 🔧 数据结构说明

### Project (项目)
```typescript
interface Project {
  project_name: string;       // 项目名称（如"Alpha Protocol"）
  ticker: string;             // 代币ticker（如"ALPHA"）
  initial_cash: number;       // 初始现金（USD）
  initial_token: number;      // 初始代币数量
  initial_date: string;       // 项目启动日期（ISO格式）
  initial_snapshot_id: string; // 初始快照ID
}
```

### Snapshot (快照)
```typescript
interface Snapshot {
  id: string;                 // 快照唯一ID
  timestamp: string;          // 快照时间戳（ISO格式）
  total_value: number;        // 总资产价值（USD）
  spot_pnl_realized: number;  // 现货已实现PnL
  spot_pnl_unrealized: number; // 现货未实现PnL
  perp_pnl_realized: number;  // 合约已实现PnL
  perp_pnl_unrealized: number; // 合约未实现PnL
  margin_used: number;        // 已用保证金
  margin_available: number;   // 可用保证金
  margin_total: number;       // 总保证金
  cash_value: number;         // 现金价值
  token_value: number;        // 代币价值
  long_value: number;         // 多头持仓价值
  short_value: number;        // 空头持仓价值
}
```

### RoleBreakdown (角色分布)
```typescript
interface RoleBreakdown {
  role: 'CEX' | 'LP' | 'MM' | 'LOCK' | 'WHALE' | 'VC';
  value: number;   // 该角色持有的资产价值（USD）
  share: number;   // 占比（0-100）
}

// 角色说明：
// - CEX: 中心化交易所
// - LP: 流动性提供者
// - MM: 做市商
// - LOCK: 锁仓合约
// - WHALE: 巨鲸持有者
// - VC: 风险投资机构
```

### WalletHolding (钱包持仓)
```typescript
interface WalletHolding {
  id: string;
  controller: string;      // 控制者/所属方
  wallet: string;          // 钱包地址
  network: string;         // 区块链网络（Ethereum/BSC/Arbitrum等）
  venue?: string;          // 场所/协议（对于外部未控）
  tags: string[];          // 标签数组（如["Treasury", "Hot Wallet"]）
  token: string;           // 代币符号（BTC/ETH/USDT等）
  quantity: number;        // 代币数量
  usd_value: number;       // USD价值
  share_percent: number;   // 占比（%）
  cost_basis?: number;     // 成本价
  current_price: number;   // 当前价格
  pnl_usd?: number;        // PnL (USD)
  pnl_percent?: number;    // PnL (%)
  last_updated: string;    // 最后更新时间
  added_date: string;      // 添加日期
  is_internal: boolean;    // 是否为内部控制
  role?: RoleBreakdown['role']; // 角色（外部未控时使用）
}
```

---

## 🎨 设计规范

### 颜色系统
- **内部控制**: 绿色 (`#10b981`, `text-green-600`)
- **外部未控**: 橙色/灰色 (`text-orange-600`)
- **角色颜色映射**:
  ```typescript
  CEX: '#ef4444'    // red-500
  LP: '#f59e0b'     // amber-500
  MM: '#eab308'     // yellow-500
  LOCK: '#8b5cf6'   // violet-500
  WHALE: '#ec4899'  // pink-500
  VC: '#06b6d4'     // cyan-500
  ```
- **正负值**: 
  - 正值: `text-green-600` + `ArrowUpRight`
  - 负值: `text-red-600` + `ArrowDownRight`
  - 持平: `text-gray-500` + `Minus`

### 间距系统
- 页面内边距: `p-4`（16px）
- 组件间距: `space-y-4` 或 `gap-4`（16px）
- 卡片内边距: `p-4`（16px）
- 紧凑模式: `gap-3`（12px）用于密集布局

### 字体规范
- **标题**: 默认字体（来自`/styles/globals.css`）
- **数字**: 必须使用 `tabular-nums`（等宽数字）
- **金额格式**: `$X.XXM`（百万为单位，保留2位小数）
- **百分比格式**: `X.X%`（保留1位小数）

### 动效规范
- **过渡时长**: `duration-200` 或 `duration-300`（200-250ms）
- **缓动函数**: `ease-out`
- **应用场景**: 
  - Hover效果: `hover:shadow-lg transition-all duration-200`
  - 数据更新: 条状图宽度变化使用 `transition-all duration-300 ease-out`

---

## 🚀 关键里程碑

### 已完成的重要功能点

1. **✅ 多项目切换系统** (2024-12)
   - 项目下拉选择器
   - 自动加载项目对应的快照数据
   - 项目信息卡片显示

2. **✅ 快照系统完整实现** (2024-12)
   - 初始快照/自动保存快照/当前快照三层结构
   - 快照选择器（下拉历史浏览）
   - "初始状态"按钮快速跳转
   - 快照链接分享功能

3. **✅ TokenIcon组件集成** (2024-12)
   - 在现货页面的钱包持仓表格中显示代币图标
   - 支持多种尺寸和边框样式

4. **✅ SegmentedComparisonBar横向布局重构** (2024-12) 🎯
   - **重要里程碑**：角色分布图例移到左侧（占约1/3宽度）
   - 外部未控标签保持在右侧
   - 互补条状图展示内部vs外部（按角色分段）
   - 应用于概览页面

5. **✅ 合约页面四个ComparisonBar** (2024-12)
   - 多/空头对比
   - 已实现/未实现PnL对比
   - 已用/可用保证金对比
   - 内部/外部持仓对比

6. **✅ 紧凑化布局优化** (2024-12)
   - 全局间距从4-6减少到3-4
   - 卡片高度优化
   - 表格行高紧凑化

---

## 💻 开发指南

### 本地运行

1. **安装依赖**
```bash
npm install
# 或
yarn install
```

2. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

3. **构建生产版本**
```bash
npm run build
# 或
yarn build
```

### 项目约定

#### 文件命名
- 组件文件: `PascalCase.tsx` (如 `OverviewPage.tsx`)
- 工具函数: `camelCase.ts` (如 `mockData.ts`)
- 类型定义: 统一放在 `/types/index.ts`

#### 组件结构
```typescript
// 1. 导入React和外部依赖
import { useState } from 'react';
import { SomeIcon } from 'lucide-react';

// 2. 导入本地组件
import { Button } from './ui/button';
import { Card } from './ui/card';

// 3. 导入类型
import type { Project, Snapshot } from '../types';

// 4. 定义Props接口
interface MyComponentProps {
  data: Project;
  onAction: () => void;
}

// 5. 组件定义（使用export function，不是export default）
export function MyComponent({ data, onAction }: MyComponentProps) {
  // 组件逻辑
  return (
    <div>...</div>
  );
}
```

#### 数据格式化函数
```typescript
// 金额格式化（百万为单位）
const formatValue = (value: number) => {
  return `$${(value / 1000000).toFixed(2)}M`;
};

// 百分比格式化
const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

// 日期格式化
const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('zh-CN');
};
```

#### 条件类名（Tailwind）
```typescript
// 使用模板字符串条件拼接
<div className={`
  text-sm 
  ${isPositive ? 'text-green-600' : 'text-red-600'}
  ${isActive && 'bg-blue-50'}
`}>
  内容
</div>
```

---

## 🔄 状态管理

### 全局状态（App.tsx）
```typescript
// 项目管理
const [currentProject, setCurrentProject] = useState<Project>(projects[0]);

// 快照管理
const [snapshots] = useState<Snapshot[]>([initialSnapshot, ...savedSnapshots]);
const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>(currentSnapshot.id);
const [displaySnapshotId, setDisplaySnapshotId] = useState<string>(currentSnapshot.id);

// UI状态
const [activeTab, setActiveTab] = useState('overview');
const [searchQuery, setSearchQuery] = useState('');
const [showInitialSnapshotDialog, setShowInitialSnapshotDialog] = useState(false);
```

### 数据流
```
1. 用户切换项目 
   → handleProjectChange() 
   → 加载新项目的快照数据 
   → 更新所有页面显示

2. 用户选择快照 
   → handleSnapshotSelect(snapshotId) 
   → 更新displaySnapshotId 
   → 重新计算派生数据 
   → 各页面组件接收新的snapshot prop

3. 用户点击"初始状态" 
   → handleViewInitialState() 
   → 跳转到initialSnapshot 
   → 显示Toast提示
```

---

## 📦 待办事项 (TODO)

### 高优先级
- [ ] **实时数据接入**: 替换mockData.ts，接入真实API
  - 快照自动保存API
  - 账户/钱包数据API
  - 价格行情API
- [ ] **筛选功能**: Header中的"筛选"按钮功能实现
  - 按账户类型筛选
  - 按交易所筛选
  - 按网络筛选
  - 按角色筛选
- [ ] **搜索功能**: 搜索框实际逻辑实现
  - 账户名称搜索
  - 钱包地址搜索
  - 代币符号搜索
- [ ] **数据导出**: "导出"按钮功能实现
  - CSV格式导出
  - Excel格式导出
  - PDF报告生成

### 中优先级
- [ ] **图表增强**: 添加更多可视化图表
  - 资产分配饼图（概览页）
  - 历史趋势折线图（各页面）
  - PnL瀑布图（合约页）
- [ ] **权限控制**: 多角色用户权限管理
  - Admin / Viewer / Operator角色
  - 敏感数据脱敏
- [ ] **快照对比**: 两个快照并排对比功能
  - 选择两个时间点
  - 并排显示差异
  - 高亮变化项
- [ ] **告警系统**: 风险监控和告警
  - 爆仓价接近告警
  - 资产异常波动告警
  - 保证金不足告警

### 低优先级
- [ ] **暗黑模式**: 主题切换功能
- [ ] **国际化**: 多语言支持（中文/英文）
- [ ] **移动端优化**: 针对手机屏幕的布局调整
- [ ] **数据可视化增强**: 更多交互式图表
- [ ] **自定义仪表盘**: 用户可配置显示模块

---

## 🐛 已知问题

1. **模拟数据**: 当前使用mockData.ts，需要接入真实API
2. **快照生成**: 自动保存逻辑是模拟的，未实现真实的定时任务
3. **筛选/搜索**: UI已完成，但功能逻辑尚未实现
4. **权限控制**: 当前无权限验证，所有用户看到相同数据
5. **移动端体验**: 部分复杂表格在小屏幕上显示有待优化

---

## 🤝 如何让其他AI工具参与开发

### 对于Claude Code / Cursor / Windsurf

1. **下载项目**: 在Figma Make界面点击"导出"下载ZIP文件
2. **解压到本地**: 选择一个工作目录解压
3. **在Cursor/Windsurf中打开**: 
   ```bash
   cd /path/to/project
   cursor .  # 或 windsurf .
   ```
4. **提供上下文**: 将本README.md内容复制到AI对话框，告诉它：
   ```
   这是一个加密货币项目管理仪表板，请阅读README.md了解项目结构。
   我需要你帮我实现 [具体需求]。
   
   当前工作分支: [描述当前开发状态]
   需要实现的功能: [具体描述]
   ```

### 对于GitHub Copilot / VS Code

1. **打开VS Code**: 在项目根目录
2. **安装依赖**: `npm install`
3. **查看核心文件**: 
   - `/App.tsx` - 了解应用结构
   - `/types/index.ts` - 了解数据类型
   - `/lib/mockData.ts` - 了解数据格式
4. **使用Copilot**: 在代码中写注释描述需求，Copilot会自动补全

### 提示词模板（给其他AI）

```
# 项目背景
我正在开发一个加密货币项目管理仪表板（React + TypeScript + Tailwind CSS）。

# 当前状态
- 已完成四个主页面（概览/现金/现货/合约）
- 已实现多项目切换和快照系统
- 已完成SegmentedComparisonBar横向布局重构（里程碑版本）

# 技术栈
- React 18 + TypeScript
- Tailwind CSS v4
- Shadcn UI组件库
- Lucide React图标

# 当前任务
[在这里描述你的具体需求]

# 相关文件
- /App.tsx - 主应用入口
- /components/[你关注的组件].tsx
- /lib/mockData.ts - 数据源

# 设计要求
- 数字使用 tabular-nums（等宽）
- 正值绿色，负值红色
- 间距使用 gap-3 或 gap-4（紧凑布局）
- 动效使用 duration-200 或 duration-300
- 金额格式: $X.XXM（百万为单位）
- 百分比格式: X.X%（保留1位小数）

请帮我实现 [具体功能]，确保遵循上述设计规范。
```

---

## 📞 联系方式

如果有问题或建议，请通过以下方式联系：
- GitHub Issues: [项目仓库链接]
- Email: [your-email@example.com]
- Slack: [团队Slack频道]

---

## 📄 许可证

[MIT License / 或其他许可证]

---

## 🙏 致谢

- Shadcn UI: 优秀的组件库
- Tailwind CSS: 强大的CSS框架
- Lucide React: 精美的图标库
- Figma Make: 快速原型开发平台

---

**最后更新**: 2024-12-27  
**当前版本**: v1.0.0 (SegmentedComparisonBar横向布局里程碑)  
**维护者**: [你的名字]

---

## 🎯 快速参考

### 常用命令
```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 构建生产版本
npm run build
```

### 重要文件快速索引
- 🎛️ **主入口**: `/App.tsx`
- 📊 **概览页**: `/components/OverviewPage.tsx`
- 📈 **图表组件**: `/components/SegmentedComparisonBar.tsx`, `/components/ComparisonBar.tsx`
- 🪙 **代币图标**: `/components/TokenIcon.tsx`
- 🎨 **全局样式**: `/styles/globals.css`
- 📦 **类型定义**: `/types/index.ts`
- 🗂️ **模拟数据**: `/lib/mockData.ts`

### 页面路由
- `/` → 概览页 (Overview)
- `/?tab=cash` → 现金页 (Cash)
- `/?tab=spot` → 现货页 (Spot)
- `/?tab=perp` → 合约页 (Perp)
- `/?snapshot=snap_xxx_xxx` → 查看指定快照

---

*这个README由Figma Make AI助手生成，用于帮助开发者（包括其他AI工具）快速理解项目并参与开发。*
