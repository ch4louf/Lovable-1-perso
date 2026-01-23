import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '../features/auth/components/AuthForm';
import { useAuthContext } from '../features/auth/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

const ROUTES = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
} as const;

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleSubmit = async (data: any) => {
    setError(null);
    try {
      if (mode === 'signin') {
        await signIn({ email: data.email, password: data.password });
      } else {
        await signUp({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          jobTitle: data.jobTitle,
        });
      }
    } catch (err: any) {
      // Handle common errors with user-friendly messages
      const message = err?.message || 'Une erreur est survenue';
      if (message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else if (message.includes('User already registered')) {
        setError('Un compte existe déjà avec cet email');
      } else if (message.includes('Password should be')) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
      } else {
        setError(message);
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjgsMjggMCAxLDAgNTYsMGEyOCwyOCAwIDEsMCAtNTYsMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ProcessOS</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Orchestrez vos
            <br />
            <span className="text-white/80">processus métier</span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-md leading-relaxed">
            Créez, exécutez et gouvernez vos workflows avec une plateforme 
            conçue pour les équipes modernes.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '10x', label: 'Plus rapide' },
              { value: '∞', label: 'Processus' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">ProcessOS</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {mode === 'signin' ? 'Bon retour !' : 'Commencer'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'signin' 
                ? 'Connectez-vous pour accéder à votre espace' 
                : 'Créez votre compte en quelques secondes'
              }
            </p>
          </div>

          <AuthForm
            mode={mode}
            onSubmit={handleSubmit}
            onToggleMode={toggleMode}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
