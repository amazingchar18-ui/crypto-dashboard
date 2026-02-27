import { Card } from './ui/card';
import { TokenIcon } from './TokenIcon';

interface AllocationItem {
  label: string;
  value: number;
  color: string;
}

interface AllocationCardProps {
  title: string;
  items: AllocationItem[];
  type?: 'pie' | 'bar';
  showTokenIcon?: boolean; // 是否显示代币图标
}

export function AllocationCard({ title, items, type = 'bar', showTokenIcon = false }: AllocationCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-4">
      <h3 className="mb-4">{title}</h3>
      
      {type === 'pie' ? (
        <div className="space-y-3">
          <div className="relative h-40 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-40 h-40 -rotate-90">
              {items.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const previousPercentages = items
                  .slice(0, index)
                  .reduce((sum, prevItem) => sum + (prevItem.value / total) * 100, 0);
                const circumference = 2 * Math.PI * 70;
                const offset = circumference - (percentage / 100) * circumference;
                const rotation = (previousPercentages / 100) * 360;

                return (
                  <circle
                    key={item.label}
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="40"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                    style={{ transformOrigin: '100px 100px', transform: `rotate(${rotation}deg)` }}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {showTokenIcon ? (
                    <TokenIcon symbol={item.label} size="sm" />
                  ) : (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  )}
                  <span>{item.label}</span>
                </div>
                <div className="tabular-nums">
                  ${(item.value / 1000000).toFixed(2)}M ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {showTokenIcon && (
                      <TokenIcon symbol={item.label} size="sm" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <span className="tabular-nums">
                    ${(item.value / 1000000).toFixed(2)}M ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
