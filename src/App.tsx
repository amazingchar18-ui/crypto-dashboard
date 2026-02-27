import { useState } from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Activity, Download, Filter, Search, ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Toaster } from './components/ui/sonner';
import { SnapshotBar } from './components/SnapshotBar';
import { InitialSnapshotDialog } from './components/InitialSnapshotDialog';
import { OverviewPage } from './components/OverviewPage';
import { CashPage } from './components/CashPage';
import { SpotPage } from './components/SpotPage';
import { PerpPage } from './components/PerpPage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import {
  projects,
  currentSnapshots,
  initialSnapshots,
  savedSnapshotsByProject,
  venueBreakdown,
  roleBreakdown,
  cashAccounts,
  spotWalletsInternal,
  tokenDistribution,
  perpPositions,
  quadrantData,
  walletHoldingsInternal,
  walletHoldingsExternal,
} from './lib/mockData';
import type { Snapshot, Project } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInitialSnapshotDialog, setShowInitialSnapshotDialog] = useState(false);
  
  // Project management
  const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
  
  // Snapshot management - auto-generated snapshots every minute
  const initialSnapshot = initialSnapshots[currentProject.ticker];
  const savedSnapshots = savedSnapshotsByProject[currentProject.ticker];
  const currentSnapshot = currentSnapshots[currentProject.ticker];
  
  const [snapshots] = useState<Snapshot[]>([initialSnapshot, ...savedSnapshots]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>(currentSnapshot.id);
  const [displaySnapshotId, setDisplaySnapshotId] = useState<string>(currentSnapshot.id);

  const handleProjectChange = (project: Project) => {
    setCurrentProject(project);
    const newInitialSnapshot = initialSnapshots[project.ticker];
    const newSavedSnapshots = savedSnapshotsByProject[project.ticker];
    const newCurrentSnapshot = currentSnapshots[project.ticker];
    
    // Reset snapshots to the new project
    const newSnapshots = [newInitialSnapshot, ...newSavedSnapshots];
    setSelectedSnapshotId(newCurrentSnapshot.id);
    setDisplaySnapshotId(newCurrentSnapshot.id);
    
    toast.success(`已切换到项目: ${project.project_name} (${project.ticker})`);
  };

  const handleSnapshotSelect = (snapshotId: string) => {
    setSelectedSnapshotId(snapshotId);
    setDisplaySnapshotId(snapshotId);
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (snapshot) {
      const dateTime = new Date(snapshot.timestamp).toLocaleString('zh-CN');
      toast.success(`已跳转到快照: ${dateTime}`);
    }
  };

  const handleInitialSnapshot = () => {
    setShowInitialSnapshotDialog(true);
  };

  const handleViewInitialSnapshot = () => {
    setSelectedSnapshotId(initialSnapshot.id);
    setDisplaySnapshotId(initialSnapshot.id);
    setShowInitialSnapshotDialog(false);
    toast.success('已切换到初始快照');
  };

  const handleViewInitialState = () => {
    setSelectedSnapshotId(initialSnapshot.id);
    setDisplaySnapshotId(initialSnapshot.id);
    const dateTime = new Date(initialSnapshot.timestamp).toLocaleString('zh-CN');
    toast.success(`已跳转到初始状态: ${dateTime}`);
  };

  const handleShare = () => {
    const snapshot = snapshots.find(s => s.id === displaySnapshotId);
    const shareUrl = `${window.location.href}?snapshot=${displaySnapshotId}`;
    navigator.clipboard.writeText(shareUrl);
    if (snapshot) {
      const dateTime = new Date(snapshot.timestamp).toLocaleString('zh-CN');
      toast.success(`已复制快照链接: ${dateTime}`);
    } else {
      toast.success('只读链接已复制到剪贴板');
    }
  };

  const handleExport = () => {
    toast.success('数据导出已开始');
  };

  // Get the current display snapshot
  const displaySnapshot = snapshots.find(s => s.id === displaySnapshotId) || currentSnapshot;
  const isViewingLatest = displaySnapshotId === currentSnapshot.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl mb-1">Crypto Project Dashboard</h1>
                <p className="text-sm text-gray-600">
                  多项目加密资产管理平台
                </p>
              </div>
              
              {/* Project Switcher */}
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{currentProject.project_name}</span>
                        <span className="text-xs text-gray-500">({currentProject.ticker})</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {projects.map((project) => (
                      <DropdownMenuItem
                        key={project.ticker}
                        onClick={() => handleProjectChange(project)}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          project.ticker === currentProject.ticker 
                            ? 'bg-blue-500' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <div>{project.project_name}</div>
                          <div className="text-xs text-gray-500">{project.ticker}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Current Project Info Badge */}
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">当前项目:</span>
                        <span className="font-mono text-blue-700">${currentProject.ticker}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {currentProject.project_name}
                      </div>
                    </div>
                    <div className="h-8 w-px bg-blue-200"></div>
                    <div>
                      <div className="text-xs text-gray-500">启动日期</div>
                      <div className="text-xs tabular-nums">
                        {new Date(currentProject.initial_date).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    <div className="h-8 w-px bg-blue-200"></div>
                    <div>
                      <div className="text-xs text-gray-500">初始资金</div>
                      <div className="text-xs tabular-nums">
                        ${(currentProject.initial_cash / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="h-8 w-px bg-blue-200"></div>
                    <div>
                      <div className="text-xs text-gray-500">初始代币</div>
                      <div className="text-xs tabular-nums">
                        {(currentProject.initial_token / 1000000).toFixed(0)}M
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索账户、交易所..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                筛选
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                <Download className="w-4 h-4" />
                导出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Snapshot Bar */}
      <SnapshotBar
        snapshots={snapshots}
        currentSnapshotId={selectedSnapshotId}
        onSnapshotSelect={handleSnapshotSelect}
        onShare={handleShare}
        isViewingLatest={isViewingLatest}
        onReturnToLatest={() => {
          setSelectedSnapshotId(currentSnapshot.id);
          setDisplaySnapshotId(currentSnapshot.id);
          toast.success('已返回最新快照');
        }}
        onViewInitialState={handleViewInitialState}
        initialSnapshotId={initialSnapshot.id}
      />

      {/* Initial Snapshot Dialog */}
      <InitialSnapshotDialog
        open={showInitialSnapshotDialog}
        onClose={() => setShowInitialSnapshotDialog(false)}
        project={currentProject}
        initialSnapshot={initialSnapshot}
        onCompareWithCurrent={handleViewInitialSnapshot}
      />

      {/* Main Content */}
      <main>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-white border-b">
            <div className="px-6">
              <TabsList className="h-12">
                <TabsTrigger value="overview" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  概览
                </TabsTrigger>
                <TabsTrigger value="cash" className="gap-2">
                  <Wallet className="w-4 h-4" />
                  现金
                </TabsTrigger>
                <TabsTrigger value="spot" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  现货
                </TabsTrigger>
                <TabsTrigger value="perp" className="gap-2">
                  <Activity className="w-4 h-4" />
                  合约
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="m-0">
            <OverviewPage
              project={currentProject}
              snapshot={displaySnapshot}
              cashAccounts={cashAccounts}
              spotWallets={spotWalletsInternal}
              perpPositions={perpPositions}
              roles={roleBreakdown}
              quadrantData={quadrantData}
            />
          </TabsContent>

          <TabsContent value="cash" className="m-0">
            <CashPage accounts={cashAccounts} />
          </TabsContent>

          <TabsContent value="spot" className="m-0">
            <SpotPage
              internalWallets={spotWalletsInternal}
              tokenDistribution={tokenDistribution}
              roles={roleBreakdown}
              spotPnlRealized={displaySnapshot.spot_pnl_realized}
              spotPnlUnrealized={displaySnapshot.spot_pnl_unrealized}
              internalHoldings={walletHoldingsInternal}
              externalHoldings={walletHoldingsExternal}
            />
          </TabsContent>

          <TabsContent value="perp" className="m-0">
            <PerpPage
              positions={perpPositions}
              quadrantData={quadrantData}
              perpPnlRealized={displaySnapshot.perp_pnl_realized}
              perpPnlUnrealized={displaySnapshot.perp_pnl_unrealized}
              marginUsed={displaySnapshot.margin_used}
              marginAvailable={displaySnapshot.margin_available}
              marginTotal={displaySnapshot.margin_total}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
