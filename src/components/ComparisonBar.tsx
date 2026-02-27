import { Card } from './ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ComparisonBarProps {
  title: string;
  leftLabel: string;
  leftValue: number;
  leftColor?: string;
  rightLabel: string;
  rightValue: number;
  rightColor?: string;
  showPercentage?: boolean;
  valueFormat?: 'currency' | 'number';
  leftDelta?: number;
  rightDelta?: number;
}

export function ComparisonBar({
  title,
  leftLabel,
  leftValue,
  leftColor = '#3b82f6',
  rightLabel,
  rightValue,
  rightColor = '#f59e0b',
  showPercentage = true,
  valueFormat = 'currency',
  leftDelta,
  rightDelta,
}: ComparisonBarProps) {
  const total = leftValue + rightValue;
  const leftPercent = total > 0 ? (leftValue / total) * 100 : 50;
  const rightPercent = total > 0 ? (rightValue / total) * 100 : 50;

  const formatValue = (value: number) => {
    if (valueFormat === 'currency') {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return value.toLocaleString();
  };

  const renderDeltaIcon = (delta: number) => {
    if (delta > 0.1) return <ArrowUpRight className="inline w-3 h-3" />;
    if (delta < -0.1) return <ArrowDownRight className="inline w-3 h-3" />;
    return <Minus className="inline w-3 h-3" />;
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm">{title}</h4>
        <span className="text-xs text-gray-500 tabular-nums">
          总计: {formatValue(total)}
        </span>
      </div>
      
      {/* Bar Chart */}
      <div className="relative h-12 rounded-lg overflow-hidden flex shadow-sm mb-3 border border-gray-100">
        {/* Left Side */}
        <div
          className="relative flex items-center justify-end pr-4 text-white transition-all duration-300 ease-out group"
          style={{
            width: `${leftPercent}%`,
            background: `linear-gradient(135deg, ${leftColor}ee 0%, ${leftColor} 100%)`,
          }}
        >
          {leftPercent > 15 && (
            <div className="flex flex-col items-end">
              <span className="text-xs tabular-nums drop-shadow-sm">
                {formatValue(leftValue)}
              </span>
              {leftDelta !== undefined && (
                <span className="text-xs opacity-90 flex items-center gap-0.5">
                  {renderDeltaIcon(leftDelta)}
                  <span>{Math.abs(leftDelta).toFixed(1)}%</span>
                </span>
              )}
            </div>
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
        
        {/* Center Divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 transform -translate-x-1/2" />
        
        {/* Right Side */}
        <div
          className="relative flex items-center justify-start pl-4 text-white transition-all duration-300 ease-out group"
          style={{
            width: `${rightPercent}%`,
            background: `linear-gradient(135deg, ${rightColor} 0%, ${rightColor}ee 100%)`,
          }}
        >
          {rightPercent > 15 && (
            <div className="flex flex-col items-start">
              <span className="text-sm tabular-nums drop-shadow-sm">
                {formatValue(rightValue)}
              </span>
              {rightDelta !== undefined && (
                <span className="text-xs opacity-90 flex items-center gap-0.5">
                  {renderDeltaIcon(rightDelta)}
                  <span>{Math.abs(rightDelta).toFixed(1)}%</span>
                </span>
              )}
            </div>
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
      </div>

      {/* Legend and Percentages */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Legend */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ 
                backgroundColor: leftColor,
              }}
            />
            <span className="text-sm text-gray-700">{leftLabel}</span>
          </div>
          {showPercentage && (
            <div className="pl-5 flex items-baseline gap-2">
              <span className="text-xl tabular-nums">{leftPercent.toFixed(1)}%</span>
              {leftDelta !== undefined && (
                <span className={`text-xs flex items-center gap-0.5 ${
                  leftDelta > 0.1 ? 'text-green-600' : 
                  leftDelta < -0.1 ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {renderDeltaIcon(leftDelta)}
                  {Math.abs(leftDelta).toFixed(1)}%
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Right Legend */}
        <div className="flex flex-col space-y-2 items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{rightLabel}</span>
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ 
                backgroundColor: rightColor,
              }}
            />
          </div>
          {showPercentage && (
            <div className="pr-5 flex items-baseline gap-2">
              <span className="text-xl tabular-nums">{rightPercent.toFixed(1)}%</span>
              {rightDelta !== undefined && (
                <span className={`text-xs flex items-center gap-0.5 ${
                  rightDelta > 0.1 ? 'text-green-600' : 
                  rightDelta < -0.1 ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {renderDeltaIcon(rightDelta)}
                  {Math.abs(rightDelta).toFixed(1)}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
