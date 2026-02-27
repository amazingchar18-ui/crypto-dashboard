import { Building2, Droplet, Layers, Lock, Fish, Briefcase } from 'lucide-react';
import { Badge } from './ui/badge';
import type { RoleBreakdown } from '../types';

const roleConfig = {
  CEX: { icon: Building2, color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'CEX' },
  LP: { icon: Droplet, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', label: 'LP' },
  MM: { icon: Layers, color: 'bg-purple-100 text-purple-700 border-purple-300', label: 'MM' },
  LOCK: { icon: Lock, color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'LOCK' },
  WHALE: { icon: Fish, color: 'bg-green-100 text-green-700 border-green-300', label: 'WHALE' },
  VC: { icon: Briefcase, color: 'bg-pink-100 text-pink-700 border-pink-300', label: 'VC' },
};

interface RoleBadgesProps {
  roles: RoleBreakdown[];
  onRoleClick?: (role: string) => void;
}

export function RoleBadges({ roles, onRoleClick }: RoleBadgesProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {roles.map((role) => {
        const config = roleConfig[role.role];
        const Icon = config.icon;
        
        return (
          <div
            key={role.role}
            onClick={() => onRoleClick?.(role.role)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color} ${onRoleClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{config.label}</span>
            <span className="tabular-nums">
              ${(role.value / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs opacity-75 tabular-nums">
              ({role.share.toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
