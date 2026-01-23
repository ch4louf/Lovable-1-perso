import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AppLayout from './components/layout/AppLayout';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Router configuration
const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'library',
        element: <div className="p-8 text-muted-foreground">Library Page - Coming Soon</div>,
      },
      {
        path: 'library/design',
        element: <div className="p-8 text-muted-foreground">Design Library - Coming Soon</div>,
      },
      {
        path: 'library/run',
        element: <div className="p-8 text-muted-foreground">Run Library - Coming Soon</div>,
      },
      {
        path: 'tasks',
        element: <div className="p-8 text-muted-foreground">My Tasks - Coming Soon</div>,
      },
      {
        path: 'runs',
        element: <div className="p-8 text-muted-foreground">Active Runs - Coming Soon</div>,
      },
      {
        path: 'team',
        element: <div className="p-8 text-muted-foreground">Team Management - Coming Soon</div>,
      },
      {
        path: 'billing',
        element: <div className="p-8 text-muted-foreground">Billing - Coming Soon</div>,
      },
      {
        path: 'settings',
        element: <div className="p-8 text-muted-foreground">Settings - Coming Soon</div>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
