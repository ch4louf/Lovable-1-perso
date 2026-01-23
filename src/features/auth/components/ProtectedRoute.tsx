import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ROUTES = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
} as const;

interface UserPermissions {
  canDesign: boolean;
  canVerifyDesign: boolean;
  canExecute: boolean;
  canVerifyRun: boolean;
  canManageTeam: boolean;
  canAccessBilling: boolean;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof UserPermissions;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuthContext();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // Check permission if required
  if (requiredPermission && profile) {
    const permissions = profile.permissions as Record<string, boolean> | null;
    if (!permissions?.[requiredPermission]) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Accès refusé</h1>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
