import React from 'react';
import { useAuthContext } from '../features/auth/contexts/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Play, 
  TrendingUp, 
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  color: 'primary' | 'success' | 'warning' | 'info';
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'bg-success/10 text-success' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
}

function QuickAction({ title, description, icon: Icon, onClick }: QuickActionProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 
        border border-transparent hover:border-border transition-all group text-left w-full"
    >
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ArrowRight 
        size={16} 
        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </button>
  );
}

export default function DashboardPage() {
  const { profile } = useAuthContext();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting()}, {profile?.first_name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre activité
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>{new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tâches en attente"
          value={0}
          icon={CheckSquare}
          color="primary"
        />
        <StatCard
          title="Runs actifs"
          value={0}
          icon={Play}
          color="success"
        />
        <StatCard
          title="Processus à réviser"
          value={0}
          icon={AlertCircle}
          color="warning"
        />
        <StatCard
          title="Complétés ce mois"
          value={0}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          color="info"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <QuickAction
              title="Lancer un processus"
              description="Démarrer une nouvelle exécution"
              icon={Play}
            />
            <QuickAction
              title="Voir mes tâches"
              description="Consulter les tâches assignées"
              icon={CheckSquare}
            />
            <QuickAction
              title="Créer un processus"
              description="Concevoir un nouveau workflow"
              icon={Sparkles}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Activité récente</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <LayoutDashboard size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Aucune activité récente
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Votre activité apparaîtra ici
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Banner for new users */}
      {!profile?.workspace_id && (
        <div className="bg-gradient-to-r from-primary via-primary/90 to-accent rounded-2xl p-8 text-primary-foreground">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Bienvenue sur ProcessOS !</h2>
          </div>
          <p className="text-primary-foreground/80 max-w-2xl mb-6">
            Vous n'êtes pas encore membre d'un espace de travail. 
            Créez votre premier workspace ou demandez une invitation à votre équipe.
          </p>
          <button className="px-5 py-2.5 bg-white text-primary font-semibold rounded-xl 
            hover:bg-white/90 transition-colors shadow-lg">
            Créer un workspace
          </button>
        </div>
      )}
    </div>
  );
}
