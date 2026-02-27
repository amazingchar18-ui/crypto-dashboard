import { Share2, Calendar, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { SnapshotPicker } from './SnapshotPicker';
import type { Snapshot } from '../types';

interface SnapshotBarProps {
  snapshots: Snapshot[];
  currentSnapshotId: string;
  onSnapshotSelect: (snapshotId: string) => void;
  onShare: () => void;
  isViewingLatest: boolean;
  onReturnToLatest: () => void;
  onViewInitialState: () => void;
  initialSnapshotId: string;
}

export function SnapshotBar({
  snapshots,
  currentSnapshotId,
  onSnapshotSelect,
  onShare,
  isViewingLatest,
  onReturnToLatest,
  onViewInitialState,
  initialSnapshotId,
}: SnapshotBarProps) {
  const currentSnapshot = snapshots.find(s => s.id === currentSnapshotId);
  const isViewingInitial = currentSnapshotId === initialSnapshotId;

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <div className="flex items-center gap-4">
        <SnapshotPicker
          snapshots={snapshots}
          currentSnapshotId={currentSnapshotId}
          onSnapshotSelect={onSnapshotSelect}
        />
        
        <Button
          variant={isViewingInitial ? "default" : "outline"}
          size="sm"
          onClick={onViewInitialState}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          初始状态
        </Button>

        {!isViewingLatest && currentSnapshot && (
          <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 border border-orange-200 rounded-md">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-sm text-orange-900">正在查看历史快照</div>
              <div className="text-xs text-orange-700">
                {new Date(currentSnapshot.timestamp).toLocaleString('zh-CN')}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onReturnToLatest}
              className="ml-2 h-7 text-xs border-orange-300 hover:bg-orange-100"
            >
              返回最新
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-700">自动快照 (每分钟)</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          分享
        </Button>
      </div>
    </div>
  );
}
