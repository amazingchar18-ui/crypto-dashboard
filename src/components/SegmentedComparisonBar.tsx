import { Card } from './ui/card';
import { Shield, Globe } from 'lucide-react';
import type { RoleBreakdown } from '../types';

interface SegmentedComparisonBarProps {
  title: string;
  internalValue: number;
  internalLabel: string;
  externalSegments: RoleBreakdown[];
  externalLabel: string;
  showPercentage?: boolean;
}

// Role color mapping
const roleColors: Record<string, string> = {
  CEX: '#ef4444',     // red-500
  LP: '#f59e0b',      // amber-500
  MM: '#eab308',      // yellow-500
  LOCK: '#8b5cf6',    // violet-500
  WHALE: '#ec4899',   // pink-500
  VC: '#06b6d4',      // cyan-500
};

export function SegmentedComparisonBar({
  title,
  internalValue,
  internalLabel,
  externalSegments,
  externalLabel,
  showPercentage = true,
}: SegmentedComparisonBarProps) {
  const externalValue = externalSegments.reduce((sum, seg) => sum + seg.value, 0);
  const total = internalValue + externalValue;
  const internalPercent = total > 0 ? (internalValue / total) * 100 : 50;
  const externalPercent = total > 0 ? (externalValue / total) * 100 : 50;

  const formatValue = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm">{title}</h4>
        <span className="text-xs text-gray-500 tabular-nums">
          总计: {formatValue(total)}
        </span>
      </div>

      {/* Segmented Bar Chart */}
      <div className="relative h-12 rounded-lg overflow-hidden flex shadow-sm mb-3 border border-gray-100">
        {/* Internal (Left Side) */}
        <div
          className="relative flex items-center justify-end pr-4 text-white transition-all duration-300 ease-out"
          style={{
            width: `${internalPercent}%`,
            background: 'linear-gradient(135deg, #10b981ee 0%, #10b981 100%)',
          }}
        >
          {internalPercent > 15 && (
            <span className="text-xs tabular-nums drop-shadow-sm">
              {formatValue(internalValue)}
            </span>
          )}
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        {/* External (Right Side - Segmented) */}
        <div
          className="relative flex"
          style={{ width: `${externalPercent}%` }}
        >
          {externalSegments.map((segment, index) => {
            const segmentPercent = total > 0 ? (segment.value / total) * 100 : 0;
            const color = roleColors[segment.role] || '#6b7280';
            
            return (
              <div
                key={segment.role}
                className="relative flex items-center justify-center text-white transition-all duration-300 ease-out group"
                style={{
                  width: `${(segmentPercent / externalPercent) * 100}%`,
                  background: `linear-gradient(135deg, ${color} 0%, ${color}ee 100%)`,
                }}
              >
                {segmentPercent > 8 && (
                  <div className="text-xs tabular-nums drop-shadow-sm flex flex-col items-center">
                    <span className="opacity-90">{segment.role}</span>
                    <span className="text-[10px]">{formatValue(segment.value)}</span>
                  </div>
                )}
                {/* Border between segments */}
                {index < externalSegments.length - 1 && (
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" />
                )}
                {/* Subtle pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend and Percentages */}
      <div className="flex items-start justify-between gap-8">
        {/* Internal Legend */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            <span className="text-sm text-gray-700">{internalLabel}</span>
          </div>
          {showPercentage && (
            <div className="pl-5">
              <span className="text-xl tabular-nums">{internalPercent.toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* External Legend with Role Breakdown */}
        <div className="flex items-center justify-end gap-4">
          {/* Compact Role Breakdown - Left Side */}
          <div className="flex items-center gap-2 flex-wrap max-w-[35%]">
            {externalSegments.map((segment) => {
              const segmentPercent = total > 0 ? (segment.value / total) * 100 : 0;
              const color = roleColors[segment.role] || '#6b7280';
              
              return (
                <div key={segment.role} className="flex items-center gap-1 text-[10px] whitespace-nowrap">
                  <div
                    className="w-1.5 h-1.5 rounded-full shadow-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-700">{segment.role}</span>
                  <span className="text-gray-500 tabular-nums">
                    {segmentPercent.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* External Label - Right Side */}
          <div className="flex flex-col space-y-1.5 items-end flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{externalLabel}</span>
              <Globe className="w-3.5 h-3.5 text-orange-600" />
            </div>
            {showPercentage && (
              <div className="pr-5">
                <span className="text-xl tabular-nums">{externalPercent.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
