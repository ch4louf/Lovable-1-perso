import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate, useSearchParams, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { DataProvider } from './contexts/DataContext';
import { UserProvider } from './contexts/UserContext';
import { UIProvider } from './contexts/UIContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LibraryPage from './pages/LibraryPage';
import BillingPage from './pages/BillingPage';
import AppLayout from './components/layout/AppLayout';
import TeamManagement from './components/TeamManagement';
import ActiveRuns from './components/ActiveRuns';
import TaskCenter from './components/TaskCenter';
import RectoEditor from './components/RectoEditor';
import VersoExecution from './components/VersoExecution';
import RunProcessModal from './components/RunProcessModal';
import { ProcessDefinition, ProcessRun } from './types';
import { useData } from './contexts/DataContext';
import { useUser } from './contexts/UserContext';
import { useUI } from './contexts/UIContext';

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

// =============== PAGE WRAPPERS ===============
// These wrappers connect the old components to React Router

function DashboardPageWrapper() {
  const navigate = useNavigate();
  
  const handleAction = (type: 'RUN' | 'PROCESS', id: string) => {
    if (type === 'RUN') {
      navigate(`/runs/${id}`);
    } else {
      navigate(`/library/design?processId=${id}`);
    }
  };
  
  const handleNavigate = (tab: string) => {
    const routes: Record<string, string> = {
      'MY_TASKS': '/tasks',
      'LIBRARY': '/library/run',
      'PROCESS_RUNS': '/runs',
      'TEAM': '/team',
      'BILLING': '/billing',
    };
    navigate(routes[tab] || '/dashboard');
  };
  
  return <DashboardPage onAction={handleAction} onNavigate={handleNavigate} />;
}

function TasksPageWrapper() {
  const navigate = useNavigate();
  
  const handleOpenRun = (runId: string) => {
    navigate(`/runs/${runId}`);
  };
  
  return (
    <div className="flex flex-col h-full">
      <TaskCenter onOpenRun={handleOpenRun} />
    </div>
  );
}

function LibraryPageWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { processes, addRun } = useData();
  const { currentUser } = useUser();
  const { showToast } = useUI();
  
  const [runModalProcess, setRunModalProcess] = useState<ProcessDefinition | null>(null);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(searchParams.get('processId'));
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Determine context from URL
  const isDesignContext = window.location.pathname.includes('/design');
  const libraryContext = isDesignContext ? 'DESIGN' : 'RUN';
  
  const handleOpenProcess = (p: ProcessDefinition, readOnly: boolean) => {
    setActiveProcessId(p.id);
    setIsReadOnly(readOnly);
  };
  
  const handleEditProcess = (p: ProcessDefinition) => {
    setActiveProcessId(p.id);
    setIsReadOnly(false);
  };
  
  const handleRunProcess = (p: ProcessDefinition) => {
    setRunModalProcess(p);
  };
  
  const handleCloseEditor = () => {
    setActiveProcessId(null);
  };
  
  const handleConfirmRun = (runName: string) => {
    if (!runModalProcess) return;
    
    const newRun: ProcessRun = {
      id: `run-${Date.now()}`,
      rootProcessId: runModalProcess.rootId,
      versionId: runModalProcess.id,
      processTitle: runModalProcess.title,
      runName,
      startedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      startedAt: new Date().toISOString(),
      stepValues: {},
      completedStepIds: [],
      stepFeedback: {},
      status: 'IN_PROGRESS',
      activityLog: [{
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        action: 'Started the run',
        timestamp: new Date().toISOString()
      }],
      healthScore: 100,
      lastInteractionAt: new Date().toISOString()
    };
    
    addRun(newRun);
    setRunModalProcess(null);
    showToast(`Run "${runName}" started successfully!`);
    navigate(`/runs/${newRun.id}`);
  };
  
  const activeProcess = activeProcessId ? processes.find(p => p.id === activeProcessId) : null;
  
  // If a process is open, show the editor
  if (activeProcess) {
    return (
      <RectoEditor 
        process={activeProcess} 
        onClose={handleCloseEditor}
        readOnly={isReadOnly}
      />
    );
  }
  
  return (
    <>
      <LibraryPage 
        libraryContext={libraryContext as 'DESIGN' | 'RUN'}
        onOpenProcess={handleOpenProcess}
        onEditProcess={handleEditProcess}
        onRunProcess={handleRunProcess}
      />
      
      {runModalProcess && (
        <RunProcessModal 
          process={runModalProcess}
          activeRunCount={0}
          onClose={() => setRunModalProcess(null)}
          onConfirm={handleConfirmRun}
        />
      )}
    </>
  );
}

function ActiveRunsPageWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('processId');
  
  const handleOpenRun = (runId: string) => {
    navigate(`/runs/${runId}`);
  };
  
  return <ActiveRuns onOpenRun={handleOpenRun} initialFilter={initialFilter} />;
}

function RunDetailPageWrapper() {
  const navigate = useNavigate();
  const { runs, processes, updateRun } = useData();
  const runId = window.location.pathname.split('/runs/')[1];
  
  const run = runs.find(r => r.id === runId);
  const process = run ? processes.find(p => p.id === run.versionId) : null;
  
  if (!run || !process) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Run not found</h2>
          <p className="text-muted-foreground mb-4">The run you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/runs')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Runs
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <VersoExecution 
      run={run}
      process={process}
      onUpdateRun={updateRun}
      onClose={() => navigate('/runs')}
    />
  );
}

function TeamPageWrapper() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'lastName', direction: 'asc' });
  const [activeHeaderMenu, setActiveHeaderMenu] = useState<string | null>(null);
  
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole(null);
    setFilterStatus(null);
  };
  
  return (
    <TeamManagement
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterRole={filterRole}
      setFilterRole={setFilterRole}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      isSortOpen={isSortOpen}
      setIsSortOpen={setIsSortOpen}
      sortConfig={sortConfig}
      onSort={handleSort}
      activeHeaderMenu={activeHeaderMenu}
      onToggleHeaderMenu={setActiveHeaderMenu}
      onClearFilters={handleClearFilters}
    />
  );
}

// =============== ROUTER CONFIGURATION ===============

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DataProvider>
          <UserProvider>
            <UIProvider>
              <AppLayout />
            </UIProvider>
          </UserProvider>
        </DataProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPageWrapper />,
      },
      {
        path: 'tasks',
        element: <TasksPageWrapper />,
      },
      {
        path: 'library',
        element: <Navigate to="/library/run" replace />,
      },
      {
        path: 'library/run',
        element: <LibraryPageWrapper />,
      },
      {
        path: 'library/design',
        element: <LibraryPageWrapper />,
      },
      {
        path: 'runs',
        element: <ActiveRunsPageWrapper />,
      },
      {
        path: 'runs/:runId',
        element: <RunDetailPageWrapper />,
      },
      {
        path: 'team',
        element: <TeamPageWrapper />,
      },
      {
        path: 'billing',
        element: <BillingPage />,
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
