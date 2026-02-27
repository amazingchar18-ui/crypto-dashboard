import { useState } from 'react';
import { Shield, Globe, Wallet, TrendingUp, ExternalLink } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { RoleBadges } from './RoleBadges';
import { AllocationCard } from './AllocationCard';
import { WalletHoldingsTable } from './WalletHoldingsTable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { SpotWallet, TokenDistribution, RoleBreakdown, WalletHolding } from '../types';

interface SpotPageProps {
  internalWallets: SpotWallet[];
  tokenDistribution: TokenDistribution[];
  roles: RoleBreakdown[];
  spotPnlRealized: number;
  spotPnlUnrealized: number;
  internalHoldings: WalletHolding[];
  externalHoldings: WalletHolding[];
}

export function SpotPage({
  internalWallets,
  tokenDistribution,
  roles,
  spotPnlRealized,
  spotPnlUnrealized,
  internalHoldings,
  externalHoldings,
}: SpotPageProps) {
  const [viewMode, setViewMode] = useState<'internal' | 'external' | 'combined'>('combined');

  const internalValue = internalWallets.reduce((sum, w) => sum + w.value_usd, 0);
  const externalValue = roles.reduce((sum, r) => sum + r.value, 0);
  const totalValue = internalValue + externalValue;
  const internalPercent = (internalValue / totalValue) * 100;
  const externalPercent = (externalValue / totalValue) * 100;

  // Get blockchain explorer URL based on network
  const getExplorerUrl = (network: string, address: string): string => {
    const explorers: Record<string, string> = {
      'Ethereum': 'https://etherscan.io/address/',
      'BSC': 'https://bscscan.com/address/',
      'Polygon': 'https://polygonscan.com/address/',
      'Arbitrum': 'https://arbiscan.io/address/',
      'Optimism': 'https://optimistic.etherscan.io/address/',
      'Avalanche': 'https://snowtrace.io/address/',
      'Base': 'https://basescan.org/address/',
      'Solana': 'https://solscan.io/account/',
    };
    
    const baseUrl = explorers[network] || explorers['Ethereum'];
    return `${baseUrl}${address}`;
  };

  const openExplorer = (network: string, address: string) => {
    window.open(getExplorerUrl(network, address), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KpiCard
          title="现货总市值"
          value={`$${(totalValue / 1000000).toFixed(2)}M`}
          delta={1850000}
          deltaPercent={5.9}
          color="blue"
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <KpiCard
          title="已实现 PnL"
          value={`$${(spotPnlRealized / 1000000).toFixed(2)}M`}
          deltaPercent={12.3}
          color="green"
          icon={<Wallet className="w-6 h-6" />}
        />
        <KpiCard
          title="未实现 PnL"
          value={`$${(spotPnlUnrealized / 1000000).toFixed(2)}M`}
          deltaPercent={8.7}
          color="purple"
        />
        <KpiCard
          title="内部控制比例"
          value={`${internalPercent.toFixed(1)}%`}
          color="orange"
          icon={<Shield className="w-6 h-6" />}
        />
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList>
          <TabsTrigger value="combined">合并视图</TabsTrigger>
          <TabsTrigger value="internal">内部控制</TabsTrigger>
          <TabsTrigger value="external">外部未控</TabsTrigger>
        </TabsList>

        <TabsContent value="combined" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Internal Control */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  内部控制
                </h3>
                <span className="text-sm text-gray-600">
                  ${(internalValue / 1000000).toFixed(2)}M ({internalPercent.toFixed(1)}%)
                </span>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>钱包</TableHead>
                      <TableHead>网络</TableHead>
                      <TableHead className="text-right">价值</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internalWallets.map((wallet) => (
                      <TableRow key={wallet.wallet}>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{wallet.wallet}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => openExplorer(wallet.network, wallet.wallet)}
                                      className="text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>在 {wallet.network} 区块链浏览器中查看</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {wallet.tag}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {wallet.network}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          ${(wallet.value_usd / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {wallet.share.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <AllocationCard
                title="资产分布（内部）"
                items={tokenDistribution.map((t) => ({
                  label: t.token,
                  value: t.value,
                  color: t.token === 'ALPHA' ? '#3b82f6' : t.token === 'ETH' ? '#8b5cf6' : '#f59e0b',
                }))}
                showTokenIcon
              />
            </div>

            {/* External Uncontrolled */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-600" />
                  外部未控
                </h3>
                <span className="text-sm text-gray-600">
                  ${(externalValue / 1000000).toFixed(2)}M ({externalPercent.toFixed(1)}%)
                </span>
              </div>

              <div>
                <h4 className="text-sm mb-3">角色分层</h4>
                <RoleBadges roles={roles} />
              </div>

              <AllocationCard
                title="角色占比"
                items={roles.map((r) => ({
                  label: r.role,
                  value: r.value,
                  color:
                    r.role === 'CEX' ? '#3b82f6' :
                    r.role === 'LP' ? '#06b6d4' :
                    r.role === 'MM' ? '#8b5cf6' :
                    r.role === 'LOCK' ? '#f59e0b' :
                    r.role === 'WHALE' ? '#22c55e' :
                    '#ec4899',
                }))}
              />
            </div>
          </div>

          {/* Detailed Holdings Tables for Combined View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WalletHoldingsTable 
              holdings={internalHoldings} 
              title="内部控制 - 钱包持仓明细"
            />
            <WalletHoldingsTable 
              holdings={externalHoldings} 
              title="外部未控 - 钱包持仓明细"
            />
          </div>
        </TabsContent>

        <TabsContent value="internal" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4">钱包清单</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>钱包</TableHead>
                      <TableHead>网络</TableHead>
                      <TableHead>标签</TableHead>
                      <TableHead className="text-right">价值</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internalWallets.map((wallet) => (
                      <TableRow key={wallet.wallet}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{wallet.wallet}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => openExplorer(wallet.network, wallet.wallet)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>在 {wallet.network} 区块链浏览器中查看</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {wallet.network}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {wallet.tag}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          ${(wallet.value_usd / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {wallet.share.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="mb-4">资产分布</h3>
              <AllocationCard
                title="代币持仓"
                type="pie"
                items={tokenDistribution.map((t) => ({
                  label: t.token,
                  value: t.value,
                  color: t.token === 'ALPHA' ? '#3b82f6' : t.token === 'ETH' ? '#8b5cf6' : '#f59e0b',
                }))}
                showTokenIcon
              />
            </div>
          </div>

          {/* Detailed Holdings Table for Internal View */}
          <div className="mt-8">
            <WalletHoldingsTable 
              holdings={internalHoldings} 
              title="内部控制 - 钱包持仓明细"
            />
          </div>
        </TabsContent>

        <TabsContent value="external" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4">角色分布</h3>
              <RoleBadges roles={roles} />
              
              <div className="mt-6">
                <AllocationCard
                  title="角色价值占比"
                  items={roles.map((r) => ({
                    label: r.role,
                    value: r.value,
                    color:
                      r.role === 'CEX' ? '#3b82f6' :
                      r.role === 'LP' ? '#06b6d4' :
                      r.role === 'MM' ? '#8b5cf6' :
                      r.role === 'LOCK' ? '#f59e0b' :
                      r.role === 'WHALE' ? '#22c55e' :
                      '#ec4899',
                  }))}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4">交易所/协议分布</h3>
              <AllocationCard
                title="场所分布"
                items={[
                  { label: 'Binance', value: 8500000, color: '#f59e0b' },
                  { label: 'Uniswap', value: 7300000, color: '#ec4899' },
                  { label: 'Bybit', value: 5200000, color: '#8b5cf6' },
                  { label: 'PancakeSwap', value: 4800000, color: '#06b6d4' },
                  { label: 'Gate.io', value: 3800000, color: '#3b82f6' },
                  { label: 'Others', value: 3580000, color: '#6b7280' },
                ]}
              />
            </div>
          </div>

          {/* Detailed Holdings Table for External View */}
          <div className="mt-8">
            <WalletHoldingsTable 
              holdings={externalHoldings} 
              title="外部未控 - 钱包持仓明细"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
