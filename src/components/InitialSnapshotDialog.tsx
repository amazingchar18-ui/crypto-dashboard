import { Calendar, DollarSign, Coins, GitCompare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Project, Snapshot } from '../types';

interface InitialSnapshotDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  initialSnapshot: Snapshot;
  onCompareWithCurrent?: () => void;
}

export function InitialSnapshotDialog({
  open,
  onClose,
  project,
  initialSnapshot,
  onCompareWithCurrent,
}: InitialSnapshotDialogProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatValue = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            初始快照 #{initialSnapshot.id}
          </DialogTitle>
          <DialogDescription>
            查看项目启动时的初始状态快照和基准数据
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">项目名称</div>
                <div>{project.project_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">代币符号</div>
                <div>{project.ticker}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">启动日期</div>
                <div>{formatDate(initialSnapshot.timestamp)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">快照ID</div>
                <div className="text-xs text-gray-500">{initialSnapshot.id}</div>
              </div>
            </div>
          </div>

          {/* Initial Values */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">初始现金</div>
                  <div className="text-2xl tabular-nums">
                    {formatValue(project.initial_cash)}
                  </div>
                </div>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">初始代币</div>
                  <div className="text-2xl tabular-nums">
                    {(project.initial_token / 1000000).toFixed(0)}M
                  </div>
                </div>
                <Coins className="w-6 h-6 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Snapshot Details */}
          <div>
            <h4 className="mb-3">快照详情</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">总价值</span>
                <span className="tabular-nums">{formatValue(initialSnapshot.total_value)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">现金价值</span>
                <span className="tabular-nums">{formatValue(initialSnapshot.cash_value)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">代币价值</span>
                <span className="tabular-nums">{formatValue(initialSnapshot.token_value)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">已实现现货PnL</span>
                <span className="tabular-nums">{formatValue(initialSnapshot.spot_pnl_realized)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">已实现合约PnL</span>
                <span className="tabular-nums">{formatValue(initialSnapshot.perp_pnl_realized)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">保证金总额</span>
                <span className="tabular-nums">{formatValue(initialSnapshot.margin_total)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                这是项目启动时的初始状态快照，可以作为基准点来查看项目发展历程。
              </p>
              {onCompareWithCurrent && (
                <Button
                  onClick={onCompareWithCurrent}
                  className="gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  查看此快照
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
