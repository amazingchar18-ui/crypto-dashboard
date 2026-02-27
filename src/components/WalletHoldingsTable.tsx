import { useState } from 'react';
import { ExternalLink, MoreHorizontal, Search, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { TokenIcon } from './TokenIcon';
import type { WalletHolding } from '../types';

interface WalletHoldingsTableProps {
  holdings: WalletHolding[];
  title?: string;
  showController?: boolean;
}

export function WalletHoldingsTable({ holdings, title, showController = true }: WalletHoldingsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!holdings || holdings.length === 0) {
    return (
      <div className="space-y-3">
        {title && <h3 className="text-sm">{title}</h3>}
        <div className="border rounded-lg p-8 text-center text-gray-500 text-sm bg-white shadow-sm">
          暂无数据
        </div>
      </div>
    );
  }

  const getExplorerUrl = (network: string, address: string): string => {
    const explorers: Record<string, string> = {
      'Ethereum': 'https://etherscan.io/address/',
      'BSC': 'https://bscscan.com/address/',
      'Polygon': 'https://polygonscan.com/address/',
      'Arbitrum': 'https://arbiscan.io/address/',
      'Optimism': 'https://optimistic.etherscan.io/address/',
      'Avalanche': 'https://snowtrace.io/address/',
      'Base': 'https://basescan.org/address/',
      'Solana': 'https://solscan.io/account/',
    };
    
    const baseUrl = explorers[network] || explorers['Ethereum'];
    return `${baseUrl}${address}`;
  };

  const openExplorer = (network: string, address: string) => {
    window.open(getExplorerUrl(network, address), '_blank', 'noopener,noreferrer');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getRoleBadgeColor = (role?: string) => {
    const colors: Record<string, string> = {
      'CEX': 'bg-blue-100 text-blue-700',
      'LP': 'bg-cyan-100 text-cyan-700',
      'MM': 'bg-purple-100 text-purple-700',
      'LOCK': 'bg-orange-100 text-orange-700',
      'WHALE': 'bg-green-100 text-green-700',
      'VC': 'bg-pink-100 text-pink-700',
    };
    return colors[role || ''] || 'bg-gray-100 text-gray-700';
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      // Internal Control Tags
      'Treasury': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Strategy': 'bg-blue-100 text-blue-700 border-blue-200',
      'Team': 'bg-purple-100 text-purple-700 border-purple-200',
      'Staking': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'LP Provider': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Vesting': 'bg-amber-100 text-amber-700 border-amber-200',
      'Development': 'bg-violet-100 text-violet-700 border-violet-200',
      'Marketing': 'bg-pink-100 text-pink-700 border-pink-200',
      'Operations': 'bg-teal-100 text-teal-700 border-teal-200',
      'Reserve': 'bg-green-100 text-green-700 border-green-200',
      // External/Common Tags
      'Hot Wallet': 'bg-rose-100 text-rose-700 border-rose-200',
      'Cold Wallet': 'bg-slate-100 text-slate-700 border-slate-200',
      'ALPHA-ETH Pool': 'bg-sky-100 text-sky-700 border-sky-200',
      'MM Contract': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      '6-month cliff': 'bg-orange-100 text-orange-700 border-orange-200',
      '24-month linear': 'bg-lime-100 text-lime-700 border-lime-200',
      'Early Investor': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Exchange Wallet': 'bg-blue-100 text-blue-700 border-blue-200',
      // Default
      'default': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[tag] || colors['default'];
  };

  // 检测地址是否为有效的钱包地址格式
  const isValidWalletAddress = (address: string): boolean => {
    const trimmedAddress = address.trim();
    // EVM 地址格式 (0x开头，42个字符)
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) return true;
    // Solana 地址格式 (base58, 32-44个字符)
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmedAddress)) return true;
    return false;
  };

  // 检测搜索词可能对应的网络
  const detectNetwork = (address: string): string => {
    const trimmedAddress = address.trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
      return 'Ethereum'; // 默认使用Ethereum浏览器
    }
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmedAddress)) {
      return 'Solana';
    }
    return 'Ethereum'; // 默认
  };

  // 过滤钱包持仓数据
  const filteredHoldings = searchQuery.trim() === '' 
    ? holdings 
    : holdings.filter(holding => 
        holding.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.controller?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.network.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const hasSearchQuery = searchQuery.trim() !== '';
  const hasResults = filteredHoldings.length > 0;
  const isValidAddress = isValidWalletAddress(searchQuery.trim());

  // 高亮搜索关键词
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    // 转义正则表达式特殊字符
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    try {
      const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
      return parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch (error) {
      // 如果正则表达式有问题，直接返回原文本
      return text;
    }
  };

  return (
    <div className="space-y-2">
      {title && <h3 className="text-sm">{title}</h3>}
      
      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索钱包地址、控制者、代币或网络..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 无搜索结果提示 */}
      {hasSearchQuery && !hasResults && (
        <div className="border rounded-lg p-8 text-center bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                未找到匹配 <span className="font-mono text-gray-900">{searchQuery}</span> 的钱包地址
              </p>
              {isValidAddress && (
                <p className="text-xs text-gray-500">
                  这似乎是一个有效的钱包地址
                </p>
              )}
            </div>
            {isValidAddress && (
              <div>
                <Button
                  onClick={() => {
                    const network = detectNetwork(searchQuery);
                    openExplorer(network, searchQuery.trim());
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  在区块链浏览器中查看
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 表格 */}
      {hasResults && (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          {hasSearchQuery && (
            <div className="px-4 py-2 bg-blue-50 border-b text-xs text-blue-700">
              找到 {filteredHoldings.length} 条匹配结果
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b h-9">
                {showController && <TableHead className="text-xs py-2">控制者</TableHead>}
                <TableHead className="text-xs py-2">钱包地址</TableHead>
                <TableHead className="text-xs py-2">网络</TableHead>
                <TableHead className="text-xs py-2">标签</TableHead>
                <TableHead className="text-xs py-2">代币</TableHead>
                <TableHead className="text-right text-xs py-2">数量</TableHead>
                <TableHead className="text-right text-xs py-2">价值</TableHead>
                <TableHead className="text-right text-xs py-2">占比</TableHead>
                <TableHead className="text-right text-xs py-2">24h</TableHead>
                <TableHead className="text-right text-xs py-2">PnL</TableHead>
                <TableHead className="text-xs py-2">更新时间</TableHead>
                <TableHead className="w-8 py-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHoldings.map((holding) => (
                <TableRow key={holding.id} className="hover:bg-gray-50 transition-colors h-11">
                  {showController && (
                    <TableCell className="text-xs py-2">
                      {hasSearchQuery && holding.controller ? (
                        highlightText(holding.controller, searchQuery)
                      ) : (
                        holding.controller
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-700">
                        {hasSearchQuery ? (
                          highlightText(holding.wallet, searchQuery)
                        ) : (
                          `${holding.wallet.slice(0, 6)}...${holding.wallet.slice(-4)}`
                        )}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => openExplorer(holding.network, holding.wallet)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>在区块链浏览器中查看</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {hasSearchQuery ? highlightText(holding.network, searchQuery) : holding.network}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {holding.role && (
                        <Badge className={`text-xs ${getRoleBadgeColor(holding.role)}`}>
                          {holding.role}
                        </Badge>
                      )}
                      {holding.tags.slice(0, 2).map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className={`text-xs border ${getTagColor(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {holding.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{holding.tags.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TokenIcon symbol={holding.token} size="sm" />
                      <span className="text-xs">
                        {hasSearchQuery ? highlightText(holding.token, searchQuery) : holding.token}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    {formatNumber(holding.quantity)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    ${formatNumber(holding.usd_value)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    {holding.share_percent.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    {holding.pnl_percent !== undefined && (
                      <span className={holding.pnl_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {holding.pnl_percent >= 0 ? '+' : ''}
                        {holding.pnl_percent.toFixed(1)}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    {holding.pnl_usd !== undefined && (
                      <span className={holding.pnl_usd >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {holding.pnl_usd >= 0 ? '+' : ''}
                        ${formatNumber(Math.abs(holding.pnl_usd))}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {new Date(holding.last_updated).toLocaleString('zh-CN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>编辑标签</DropdownMenuItem>
                        <DropdownMenuItem>导出数据</DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openExplorer(holding.network, holding.wallet)}
                        >
                          在浏览器中查看
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      )}
    </div>
  );
}
