interface TokenIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TokenIcon({ symbol, size = 'md', className = '' }: TokenIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // 币种颜色映射 - 使用渐变色
  const tokenColors: Record<string, { from: string; to: string; text: string }> = {
    'ALPHA': { from: '#3b82f6', to: '#1d4ed8', text: '#fff' },
    'ETH': { from: '#8b5cf6', to: '#6d28d9', text: '#fff' },
    'BTC': { from: '#f59e0b', to: '#d97706', text: '#fff' },
    'USDT': { from: '#22c55e', to: '#16a34a', text: '#fff' },
    'USDC': { from: '#3b82f6', to: '#1e40af', text: '#fff' },
    'BNB': { from: '#eab308', to: '#ca8a04', text: '#fff' },
    'SOL': { from: '#a855f7', to: '#7c3aed', text: '#fff' },
    'MATIC': { from: '#8b5cf6', to: '#6d28d9', text: '#fff' },
    'ARB': { from: '#06b6d4', to: '#0891b2', text: '#fff' },
    'OP': { from: '#ef4444', to: '#dc2626', text: '#fff' },
    'AVAX': { from: '#ef4444', to: '#b91c1c', text: '#fff' },
    'DAI': { from: '#eab308', to: '#ca8a04', text: '#fff' },
    'LINK': { from: '#3b82f6', to: '#1e40af', text: '#fff' },
    'UNI': { from: '#ec4899', to: '#db2777', text: '#fff' },
    'AAVE': { from: '#8b5cf6', to: '#6d28d9', text: '#fff' },
    'CRV': { from: '#3b82f6', to: '#1d4ed8', text: '#fff' },
    'SUSHI': { from: '#ec4899', to: '#db2777', text: '#fff' },
  };

  const getTokenInitials = (token: string): string => {
    if (token.length <= 2) return token;
    if (token === 'USDT' || token === 'USDC') return token.slice(0, 2);
    return token.slice(0, 2);
  };

  const colors = tokenColors[symbol] || { 
    from: '#6b7280', 
    to: '#4b5563', 
    text: '#fff' 
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
        color: colors.text,
      }}
    >
      <span className={`
        ${size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs'}
      `}>
        {getTokenInitials(symbol)}
      </span>
    </div>
  );
}
