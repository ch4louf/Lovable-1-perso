import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Play,
  CheckSquare,
  Users,
  Settings,
  CreditCard,
  LogOut,
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  Palette,
  Zap,
} from 'lucide-react';

// Navigation items
const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Mes Tâches', icon: CheckSquare, badge: 0 },
  { 
    path: '/library', 
    label: 'Bibliothèque', 
    icon: BookOpen,
    children: [
      { path: '/library/run', label: 'Exécuter', icon: Play },
      { path: '/library/design', label: 'Concevoir', icon: Palette },
    ]
  },
  { path: '/runs', label: 'Runs Actifs', icon: Zap },
  { path: '/team', label: 'Équipe', icon: Users },
];

const bottomNavItems = [
  { path: '/billing', label: 'Facturation', icon: CreditCard },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export default function AppLayout() {
  const { profile, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(['/library']);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleGroup = (path: string) => {
    setExpandedGroups(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  function NavItem({ item, isChild = false }: { item: any, isChild?: boolean, key?: string }) {
    const hasChildren = 'children' in item && item.children;
    const isExpanded = expandedGroups.includes(item.path);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleGroup(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all`}
          >
            <Icon size={18} />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 pl-3 border-l border-border space-y-1">
              {item.children?.map((child: any) => (
                <NavItem key={child.path} item={child} isChild />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => `
          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }
          ${isChild ? 'text-xs py-2' : ''}
        `}
      >
        <Icon size={isChild ? 16 : 18} />
        <span className="flex-1">{item.label}</span>
        {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
          <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full font-bold">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-card">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">ProcessOS</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-muted/50 border border-transparent
                focus:border-primary focus:bg-background outline-none transition-all"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 space-y-1 border-t border-border">
          {bottomNavItems.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.job_title || 'Team Member'}
              </p>
            </div>
            <button 
              onClick={handleSignOut}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
          <div className="text-sm text-muted-foreground">
            {/* Breadcrumb could go here */}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
