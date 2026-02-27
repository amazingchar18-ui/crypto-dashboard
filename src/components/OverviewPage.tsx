import { DollarSign, TrendingUp, Wallet, Activity, Shield, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { Card } from './ui/card';
import { SegmentedComparisonBar } from './SegmentedComparisonBar';
import { ComparisonBar } from './ComparisonBar';
import type { Project, Snapshot, CashAccount, SpotWallet, PerpPosition, RoleBreakdown, QuadrantData } from '../types';

interface OverviewPageProps {
  project: Project;
  snapshot: Snapshot;
  cashAccounts: CashAccount[];
  spotWallets: SpotWallet[];
  perpPositions: PerpPosition[];
  roles: RoleBreakdown[];
  quadrantData: {
    internal_long: QuadrantData;
    internal_short: QuadrantData;
    external_long: QuadrantData;
    external_short: QuadrantData;
  };
}

export function OverviewPage({
  project,
  snapshot,
  cashAccounts,
  spotWallets,
  perpPositions,
  roles,
  quadrantData,
}: OverviewPageProps) {
  // Calculate cash metrics
  const totalCash = cashAccounts.reduce((sum, acc) => sum + acc.total_usd, 0);
  const cashAssetCount = new Set(
    cashAccounts.flatMap((acc) => Object.keys(acc.assets))
  ).size;

  // Calculate spot metrics
  const internalSpotValue = spotWallets.reduce((sum, w) => sum + w.value_usd, 0);
  const externalSpotValue = roles.reduce((sum, r) => sum + r.value, 0);
  const totalSpotValue = internalSpotValue + externalSpotValue;
  const spotPnl = snapshot.spot_pnl_realized + snapshot.spot_pnl_unrealized;

  // Calculate perp metrics
  const totalPerpNotional = perpPositions.reduce(
    (sum, p) => sum + Math.abs(p.size * p.mark),
    0
  );
  const perpPnl = snapshot.perp_pnl_realized + snapshot.perp_pnl_unrealized;
  const perpLongValue = perpPositions
    .filter(p => p.side === 'Long')
    .reduce((sum, p) => sum + p.size * p.mark, 0);
  const perpShortValue = perpPositions
    .filter(p => p.side === 'Short')
    .reduce((sum, p) => Math.abs(p.size * p.mark), 0);

  // Overall metrics
  const totalAssets = totalCash + totalSpotValue + snapshot.margin_total;
  const totalPnl = spotPnl + perpPnl;
  const internalControlled = totalCash + internalSpotValue + snapshot.margin_total;
  const internalPercent = (internalControlled / (internalControlled + externalSpotValue)) * 100;

  // Allocation percentages
  const cashPercent = (totalCash / totalAssets) * 100;
  const spotPercent = (totalSpotValue / totalAssets) * 100;
  const perpPercent = (snapshot.margin_total / totalAssets) * 100;

  return (
    <div className="p-4 space-y-4">
      {/* Top Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KpiCard
          title="总资产"
          value={`$${(totalAssets / 1000000).toFixed(2)}M`}
          delta={2850000}
          deltaPercent={4.2}
          color="blue"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <KpiCard
          title="总 PnL (已实现+未实现)"
          value={`$${(totalPnl / 1000000).toFixed(2)}M`}
          deltaPercent={totalPnl >= 0 ? 8.5 : -3.2}
          color={totalPnl >= 0 ? 'green' : 'red'}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <KpiCard
          title="内部控制资产"
          value={`$${(internalControlled / 1000000).toFixed(2)}M`}
          subtitle={`占比 ${internalPercent.toFixed(1)}%`}
          color="green"
          icon={<Shield className="w-6 h-6" />}
        />
        <KpiCard
          title="外部未控资产"
          value={`$${(externalSpotValue / 1000000).toFixed(2)}M`}
          subtitle={`占比 ${((100 - internalPercent)).toFixed(1)}%`}
          color="orange"
          icon={<Globe className="w-6 h-6" />}
        />
      </div>

      {/* Asset Allocation */}
      <div>
        <h3 className="mb-3">资产配置概览</h3>
        <div className="space-y-2">
          {/* Cash allocation bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>现金 (Cash)</span>
              </span>
              <span className="tabular-nums">${(totalCash / 1000000).toFixed(2)}M ({cashPercent.toFixed(1)}%)</span>
            </div>
            <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${cashPercent}%` }}
              />
            </div>
          </div>

          {/* Spot allocation bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>现货 (Spot)</span>
              </span>
              <span className="tabular-nums">${(totalSpotValue / 1000000).toFixed(2)}M ({spotPercent.toFixed(1)}%)</span>
            </div>
            <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${spotPercent}%` }}
              />
            </div>
          </div>

          {/* Perp allocation bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>合约保证金 (Perp Margin)</span>
              </span>
              <span className="tabular-nums">${(snapshot.margin_total / 1000000).toFixed(2)}M ({perpPercent.toFixed(1)}%)</span>
            </div>
            <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${perpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Three Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Cash Card */}
        <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">现金</p>
              <h3 className="tabular-nums">${(totalCash / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">币种数量</span>
              <span className="tabular-nums">{cashAssetCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">账户数量</span>
              <span className="tabular-nums">{cashAccounts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">占总资产</span>
              <span className="tabular-nums">{cashPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">24h 变化</span>
              <span className="flex items-center gap-1 text-green-600 tabular-nums">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +1.8%
              </span>
            </div>
          </div>
        </Card>

        {/* Spot Card */}
        <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">现货</p>
              <h3 className="tabular-nums">${(totalSpotValue / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">内部控制</span>
              <span className="tabular-nums">${(internalSpotValue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">外部未控</span>
              <span className="tabular-nums">${(externalSpotValue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">总 PnL</span>
              <span className={`tabular-nums ${spotPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(spotPnl / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">24h 变化</span>
              <span className="flex items-center gap-1 text-green-600 tabular-nums">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +5.9%
              </span>
            </div>
          </div>
        </Card>

        {/* Perp Card */}
        <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">合约</p>
              <h3 className="tabular-nums">${(totalPerpNotional / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">多头敞口</span>
              <span className="tabular-nums">${(perpLongValue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">空头敞口</span>
              <span className="tabular-nums">${(perpShortValue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">总 PnL</span>
              <span className={`tabular-nums ${perpPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(perpPnl / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">保证金使用率</span>
              <span className="tabular-nums">
                {((snapshot.margin_used / snapshot.margin_total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* PnL Breakdown */}
      <div>
        <h3 className="mb-3">PnL 分解</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">现货 PnL</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">已实现</span>
                <span className="tabular-nums">${(snapshot.spot_pnl_realized / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">未实现</span>
                <span className="tabular-nums">${(snapshot.spot_pnl_unrealized / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span>总计</span>
                <span className={`tabular-nums ${spotPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(spotPnl / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">合约 PnL</span>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">已实现</span>
                <span className="tabular-nums">${(snapshot.perp_pnl_realized / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">未实现</span>
                <span className="tabular-nums">${(snapshot.perp_pnl_unrealized / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span>总计</span>
                <span className={`tabular-nums ${perpPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(perpPnl / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Internal vs External Control */}
      <div>
        <h3 className="mb-3">内部控制 vs 外部��控</h3>
        <SegmentedComparisonBar
          title="资产控制权分布"
          internalValue={internalControlled}
          internalLabel="内部控制"
          externalSegments={roles}
          externalLabel="外部未控"
        />
      </div>

      {/* Perp Exposure Analysis */}
      <div>
        <h3 className="mb-3">合约敞口分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Internal vs External */}
          <ComparisonBar
            title="内部 vs 外部敞口"
            leftLabel="内部控制"
            leftValue={
              quadrantData.internal_long.notional + 
              quadrantData.internal_short.notional
            }
            leftColor="#10b981"
            leftDelta={
              (quadrantData.internal_long.delta_24h + 
               quadrantData.internal_short.delta_24h) / 2
            }
            rightLabel="外部未控"
            rightValue={
              quadrantData.external_long.notional + 
              quadrantData.external_short.notional
            }
            rightColor="#f59e0b"
            rightDelta={
              (quadrantData.external_long.delta_24h + 
               quadrantData.external_short.delta_24h) / 2
            }
          />

          {/* Overall Long vs Short */}
          <ComparisonBar
            title="总体多空对比"
            leftLabel="多头"
            leftValue={
              quadrantData.internal_long.notional + 
              quadrantData.external_long.notional
            }
            leftColor="#10b981"
            leftDelta={
              (quadrantData.internal_long.delta_24h + 
               quadrantData.external_long.delta_24h) / 2
            }
            rightLabel="空头"
            rightValue={
              quadrantData.internal_short.notional + 
              quadrantData.external_short.notional
            }
            rightColor="#ef4444"
            rightDelta={
              (quadrantData.internal_short.delta_24h + 
               quadrantData.external_short.delta_24h) / 2
            }
          />

          {/* Internal Long vs Short */}
          <ComparisonBar
            title="内部多空对比"
            leftLabel="内部多头"
            leftValue={quadrantData.internal_long.notional}
            leftColor="#10b981"
            leftDelta={quadrantData.internal_long.delta_24h}
            rightLabel="内部空头"
            rightValue={quadrantData.internal_short.notional}
            rightColor="#ef4444"
            rightDelta={quadrantData.internal_short.delta_24h}
          />

          {/* External Long vs Short */}
          <ComparisonBar
            title="外部多空对比"
            leftLabel="外部多头"
            leftValue={quadrantData.external_long.notional}
            leftColor="#10b981"
            leftDelta={quadrantData.external_long.delta_24h}
            rightLabel="外部空头"
            rightValue={quadrantData.external_short.notional}
            rightColor="#ef4444"
            rightDelta={quadrantData.external_short.delta_24h}
          />
        </div>
      </div>
    </div>
  );
}
