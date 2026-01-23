import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Email invalide').max(255),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

const signUpSchema = signInSchema.extend({
  firstName: z.string().min(1, 'Prénom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  jobTitle: z.string().max(100).optional(),
});

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: any) => Promise<void>;
  onToggleMode: () => void;
  error?: string | null;
}

export function AuthForm({ mode, onSubmit, onToggleMode, error }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate
    const schema = mode === 'signin' ? signInSchema : signUpSchema;
    const result = schema.safeParse(formData);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(result.data);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3 pl-12 rounded-xl border transition-all duration-200
    bg-white/80 backdrop-blur-sm
    ${hasError 
      ? 'border-destructive focus:ring-destructive/20' 
      : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10'
    }
    outline-none
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Prénom</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jean"
                className={inputClass(!!validationErrors.firstName)}
              />
            </div>
            {validationErrors.firstName && (
              <p className="text-xs text-destructive">{validationErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nom</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Dupont"
                className={inputClass(!!validationErrors.lastName)}
              />
            </div>
            {validationErrors.lastName && (
              <p className="text-xs text-destructive">{validationErrors.lastName}</p>
            )}
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Fonction (optionnel)</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Directeur Financier"
              className={inputClass(false)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean@company.com"
            autoComplete="email"
            className={inputClass(!!validationErrors.email)}
          />
        </div>
        {validationErrors.email && (
          <p className="text-xs text-destructive">{validationErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            className={inputClass(!!validationErrors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-xs text-destructive">{validationErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold
          flex items-center justify-center gap-2 transition-all duration-200
          hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg shadow-primary/25"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            {mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {mode === 'signin' 
            ? "Pas encore de compte ? S'inscrire" 
            : 'Déjà un compte ? Se connecter'
          }
        </button>
      </div>
    </form>
  );
}
