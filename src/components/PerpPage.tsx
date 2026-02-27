import { Activity, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { ComparisonBar } from './ComparisonBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import type { PerpPosition, QuadrantData } from '../types';

interface PerpPageProps {
  positions: PerpPosition[];
  quadrantData: {
    internal_long: QuadrantData;
    internal_short: QuadrantData;
    external_long: QuadrantData;
    external_short: QuadrantData;
  };
  perpPnlRealized: number;
  perpPnlUnrealized: number;
  marginUsed: number;
  marginAvailable: number;
  marginTotal: number;
}

export function PerpPage({
  positions,
  quadrantData,
  perpPnlRealized,
  perpPnlUnrealized,
  marginUsed,
  marginAvailable,
  marginTotal,
}: PerpPageProps) {
  const totalNotional = positions.reduce(
    (sum, p) => sum + p.size * p.mark,
    0
  );

  const avgFundingRate = -0.0082; // Mock data
  const totalFunding = positions.reduce((sum, p) => sum + p.funding, 0);

  const riskLevelColor = {
    Low: 'bg-green-100 text-green-700 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    High: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <KpiCard
          title="名义敞口"
          value={`$${(totalNotional / 1000000).toFixed(2)}M`}
          delta={1250000}
          deltaPercent={3.2}
          color="blue"
          icon={<Activity className="w-6 h-6" />}
        />
        <KpiCard
          title="已使用保证金"
          value={`$${(marginUsed / 1000000).toFixed(2)}M`}
          subtitle={`可用: $${(marginAvailable / 1000000).toFixed(2)}M`}
          color="orange"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <KpiCard
          title="已实现 PnL"
          value={`$${(perpPnlRealized / 1000000).toFixed(2)}M`}
          deltaPercent={-5.2}
          color={perpPnlRealized >= 0 ? 'green' : 'red'}
        />
        <KpiCard
          title="未实现 PnL"
          value={`$${(perpPnlUnrealized / 1000000).toFixed(2)}M`}
          deltaPercent={12.8}
          color={perpPnlUnrealized >= 0 ? 'green' : 'red'}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <KpiCard
          title="资金费率"
          value={`${(avgFundingRate * 100).toFixed(3)}%`}
          subtitle={`累计: $${(totalFunding / 1000).toFixed(2)}k`}
          color="purple"
        />
      </div>

      {/* Comparison Charts */}
      <div>
        <h3 className="mb-4">敞口对比分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Total Long vs Short */}
          <ComparisonBar
            title="总体多空对比"
            leftLabel="多头"
            leftValue={
              quadrantData.internal_long.notional + 
              quadrantData.external_long.notional
            }
            leftColor="#22c55e"
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
            leftColor="#16a34a"
            leftDelta={quadrantData.internal_long.delta_24h}
            rightLabel="内部空头"
            rightValue={quadrantData.internal_short.notional}
            rightColor="#dc2626"
            rightDelta={quadrantData.internal_short.delta_24h}
          />

          {/* External Long vs Short */}
          <ComparisonBar
            title="外部多空对比"
            leftLabel="外部多头"
            leftValue={quadrantData.external_long.notional}
            leftColor="#84cc16"
            leftDelta={quadrantData.external_long.delta_24h}
            rightLabel="外部空头"
            rightValue={quadrantData.external_short.notional}
            rightColor="#f97316"
            rightDelta={quadrantData.external_short.delta_24h}
          />
        </div>
      </div>

      {/* Positions Table */}
      <div>
        <h3 className="mb-4">持仓明细</h3>
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-white z-10">场所</TableHead>
                <TableHead>标的</TableHead>
                <TableHead>方向</TableHead>
                <TableHead className="text-right">规模</TableHead>
                <TableHead className="text-right">入场价</TableHead>
                <TableHead className="text-right">标记价</TableHead>
                <TableHead className="text-right">强平价</TableHead>
                <TableHead className="text-right">未实现 PnL</TableHead>
                <TableHead className="text-right">保证金</TableHead>
                <TableHead className="text-right">资金费</TableHead>
                <TableHead className="text-right">风险等级</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos, index) => (
                <TableRow key={index}>
                  <TableCell className="sticky left-0 bg-white z-10">
                    {pos.venue}
                  </TableCell>
                  <TableCell>{pos.symbol}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        pos.side === 'Long'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {pos.side}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {pos.size.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${pos.entry.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${pos.mark.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${pos.liq_price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`tabular-nums ${
                        pos.pnl_unrealized >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ${(pos.pnl_unrealized / 1000).toFixed(1)}k
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${(pos.margin / 1000).toFixed(1)}k
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`tabular-nums ${
                        pos.funding >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ${pos.funding.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={riskLevelColor[pos.risk_level]}>
                      {pos.risk_level}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Change Tracker */}
      <div>
        <h3 className="mb-4">变化追踪</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">敞口变化 (24h)</div>
            <div className="text-xl tabular-nums text-green-600">+$1.25M</div>
            <div className="text-sm text-gray-500">+3.2%</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">PnL 变化 (24h)</div>
            <div className="text-xl tabular-nums text-green-600">+$280k</div>
            <div className="text-sm text-gray-500">+12.8%</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">保证金变化 (24h)</div>
            <div className="text-xl tabular-nums text-orange-600">+$150k</div>
            <div className="text-sm text-gray-500">+6.4%</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">资金费支付 (24h)</div>
            <div className="text-xl tabular-nums text-red-600">-$6.8k</div>
            <div className="text-sm text-gray-500">累计支出</div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <h3 className="mb-4">近期事件</h3>
        <div className="border rounded-lg divide-y">
          {[
            { type: '增加', time: '2h ago', venue: 'Binance', symbol: 'ALPHA-PERP', amount: '+5M', color: 'text-green-600' },
            { type: '减仓', time: '5h ago', venue: 'Bybit', symbol: 'ETH-PERP', amount: '-200', color: 'text-red-600' },
            { type: '资金费', time: '8h ago', venue: 'All', symbol: 'Funding', amount: '-$2.3k', color: 'text-orange-600' },
          ].map((event, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium">{event.type}</span>
                    <span className="text-gray-500 ml-2">{event.venue}</span>
                    <span className="text-gray-500 ml-2">{event.symbol}</span>
                  </div>
                  <div className="text-xs text-gray-500">{event.time}</div>
                </div>
              </div>
              <div className={`tabular-nums ${event.color}`}>
                {event.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
