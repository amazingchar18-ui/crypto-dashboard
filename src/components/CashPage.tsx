import { useState } from 'react';
import { DollarSign, Coins, Building2, ArrowUpDown } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { TokenIcon } from './TokenIcon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import type { CashAccount } from '../types';

interface CashPageProps {
  accounts: CashAccount[];
}

export function CashPage({ accounts }: CashPageProps) {
  const [viewMode, setViewMode] = useState<'account' | 'asset'>('account');

  const totalCash = accounts.reduce((sum, acc) => sum + acc.total_usd, 0);
  const assetCount = new Set(
    accounts.flatMap((acc) => Object.keys(acc.assets))
  ).size;
  const accountCount = accounts.length;

  // Get top 3 assets
  const assetTotals = accounts.reduce((totals, acc) => {
    Object.entries(acc.assets).forEach(([asset, data]) => {
      if (!totals[asset]) totals[asset] = 0;
      totals[asset] += data.value_usd;
    });
    return totals;
  }, {} as Record<string, number>);

  const topAssets = Object.entries(assetTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([asset]) => asset);

  // Asset view data
  const assetView = Object.entries(assetTotals).map(([asset, totalValue]) => {
    const holdings = accounts
      .filter((acc) => acc.assets[asset])
      .map((acc) => ({
        account: acc.account_id,
        balance: acc.assets[asset].balance,
        price: acc.assets[asset].price_usd,
        value: acc.assets[asset].value_usd,
      }));

    return {
      asset,
      totalValue,
      holdings,
    };
  }).sort((a, b) => b.totalValue - a.totalValue);

  return (
    <div className="p-4 space-y-4">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard
          title="现金总额 (USD)"
          value={`$${(totalCash / 1000000).toFixed(2)}M`}
          delta={125000}
          deltaPercent={1.8}
          color="green"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <KpiCard
          title="币种数量"
          value={assetCount}
          color="blue"
          icon={<Coins className="w-6 h-6" />}
        />
        <KpiCard
          title="账户数量"
          value={accountCount}
          color="purple"
          icon={<Building2 className="w-6 h-6" />}
        />
      </div>

      {/* Top 3 Assets */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600">Top 3 币种:</span>
        {topAssets.map((asset) => (
          <div
            key={asset}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
          >
            <TokenIcon symbol={asset} size="sm" />
            <span>{asset}: ${(assetTotals[asset] / 1000000).toFixed(2)}M</span>
          </div>
        ))}
      </div>

      {/* View Toggle and Tables */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'account' | 'asset')}>
        <TabsList>
          <TabsTrigger value="account">按账户查看</TabsTrigger>
          <TabsTrigger value="asset">按币种查看</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4">
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10">账户</TableHead>
                  <TableHead className="text-right">类型</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <TokenIcon symbol="USDT" size="sm" />
                      <span>USDT</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <TokenIcon symbol="USDC" size="sm" />
                      <span>USDC</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <TokenIcon symbol="ETH" size="sm" />
                      <span>ETH</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <TokenIcon symbol="BNB" size="sm" />
                      <span>BNB</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <TokenIcon symbol="DAI" size="sm" />
                      <span>DAI</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">总计 (USD)</TableHead>
                  <TableHead className="text-right">占比</TableHead>
                  <TableHead className="text-right">24h 变化</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.account_id}>
                    <TableCell className="sticky left-0 bg-white z-10">
                      {account.account_id}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {account.account_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {account.assets.USDT
                        ? `$${account.assets.USDT.value_usd.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {account.assets.USDC
                        ? `$${account.assets.USDC.value_usd.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {account.assets.ETH
                        ? `$${account.assets.ETH.value_usd.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {account.assets.BNB
                        ? `$${account.assets.BNB.value_usd.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {account.assets.DAI
                        ? `$${account.assets.DAI.value_usd.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      ${(account.total_usd / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {account.share.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`tabular-nums ${
                          account.delta_24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {account.delta_24h >= 0 ? '+' : ''}
                        {account.delta_24h.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="asset" className="mt-4">
          <div className="space-y-4">
            {assetView.map((asset) => (
              <div key={asset.asset} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TokenIcon symbol={asset.asset} size="md" />
                      <h4>{asset.asset}</h4>
                    </div>
                    <span className="tabular-nums">
                      总计: ${(asset.totalValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>账户</TableHead>
                      <TableHead className="text-right">余额</TableHead>
                      <TableHead className="text-right">价格</TableHead>
                      <TableHead className="text-right">价值 (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asset.holdings.map((holding) => (
                      <TableRow key={holding.account}>
                        <TableCell>{holding.account}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {holding.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          ${holding.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          ${holding.value.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
