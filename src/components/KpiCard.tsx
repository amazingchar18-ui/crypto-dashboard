import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './ui/card';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: number;
  deltaPercent?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  icon?: React.ReactNode;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  orange: 'bg-orange-50 border-orange-200',
  red: 'bg-red-50 border-red-200',
  gray: 'bg-gray-50 border-gray-200',
};

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
  gray: 'text-gray-600',
};

export function KpiCard({
  title,
  value,
  subtitle,
  delta,
  deltaPercent,
  color = 'blue',
  icon,
}: KpiCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return val;
  };

  const formatDelta = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      signDisplay: 'always',
    });
  };

  return (
    <Card className={`p-3 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-1">{title}</div>
          <div className="text-xl mb-0.5 tabular-nums">{formatValue(value)}</div>
          {subtitle && (
            <div className="text-xs text-gray-500">{subtitle}</div>
          )}
          
          {(delta !== undefined || deltaPercent !== undefined) && (
            <div className="flex items-center gap-2 mt-1.5">
              {delta !== undefined && (
                <div className={`flex items-center gap-1 text-xs tabular-nums ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {formatDelta(delta)}
                </div>
              )}
              {deltaPercent !== undefined && (
                <div className={`text-xs tabular-nums ${deltaPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({formatDelta(deltaPercent)}%)
                </div>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
