import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import type { VenueBreakdown } from '../types';

interface VenueTableProps {
  venues: VenueBreakdown[];
}

export function VenueTable({ venues }: VenueTableProps) {
  const getVenueTypeLabel = (type: string) => {
    switch (type) {
      case 'perp': return '合约';
      case 'spot': return '现货';
      case 'lp': return '流动性';
      default: return type;
    }
  };

  const getVenueTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
    switch (type) {
      case 'perp': return 'default';
      case 'spot': return 'secondary';
      case 'lp': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="sticky left-0 bg-white z-10 min-w-[200px] py-2">场所/市场</TableHead>
            <TableHead className="text-center py-2">类型</TableHead>
            <TableHead className="text-right py-2">价格</TableHead>
            <TableHead className="text-right py-2">持仓价值</TableHead>
            <TableHead className="text-right py-2">占比</TableHead>
            <TableHead className="text-right py-2">数量/杠杆</TableHead>
            <TableHead className="text-right py-2">多空比</TableHead>
            <TableHead className="text-right py-2">仓位数</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue, index) => (
            <TableRow key={index} className="h-12">
              {/* 场所/市场 */}
              <TableCell className="sticky left-0 bg-white z-10 py-2">
                <div>
                  <div className="text-sm">{venue.venue}</div>
                  <div className="text-xs text-gray-500">{venue.market}</div>
                </div>
              </TableCell>

              {/* 类型 */}
              <TableCell className="text-center py-2">
                <Badge variant={getVenueTypeBadgeVariant(venue.venue_type)} className="text-xs">
                  {getVenueTypeLabel(venue.venue_type)}
                </Badge>
              </TableCell>

              {/* 价格 */}
              <TableCell className="text-right py-2">
                {venue.venue_type === 'perp' ? (
                  <div>
                    <div className="tabular-nums">${venue.mark_price?.toFixed(3)}</div>
                    <div className="text-xs text-gray-500 tabular-nums">
                      指数: ${venue.index_price?.toFixed(3)}
                    </div>
                  </div>
                ) : (
                  <div className="tabular-nums">${venue.spot_price?.toFixed(3)}</div>
                )}
              </TableCell>

              {/* 持仓价值 */}
              <TableCell className="text-right tabular-nums py-2">
                ${(venue.position_value / 1000000).toFixed(2)}M
              </TableCell>

              {/* 占比 */}
              <TableCell className="text-right py-2">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${venue.share_of_total}%` }}
                    />
                  </div>
                  <span className="tabular-nums w-12">{venue.share_of_total.toFixed(1)}%</span>
                </div>
              </TableCell>

              {/* 数量/杠杆 */}
              <TableCell className="text-right py-2">
                {venue.venue_type === 'perp' ? (
                  <div>
                    <div className="tabular-nums">{venue.leverage?.toFixed(1)}x</div>
                    <div className="text-xs text-gray-500 tabular-nums">
                      保证金: ${(venue.margin_usage! / 1000000).toFixed(2)}M
                    </div>
                  </div>
                ) : venue.venue_type === 'lp' ? (
                  <div>
                    <div className="tabular-nums">{(venue.qty! / 1000000).toFixed(2)}M</div>
                    <div className="text-xs text-gray-500">代币数量</div>
                  </div>
                ) : (
                  <div className="tabular-nums">{(venue.qty! / 1000000).toFixed(2)}M</div>
                )}
              </TableCell>

              {/* 多空比 */}
              <TableCell className="text-right py-2">
                {venue.venue_type === 'perp' ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-500">多:</span>
                      <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${venue.long_percent}%` }}
                        />
                      </div>
                      <span className="tabular-nums w-8 text-xs">{venue.long_percent}%</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-500">空:</span>
                      <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${venue.short_percent}%` }}
                        />
                      </div>
                      <span className="tabular-nums w-8 text-xs">{venue.short_percent}%</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </TableCell>

              {/* 仓位数 */}
              <TableCell className="text-right tabular-nums py-2">{venue.positions_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
