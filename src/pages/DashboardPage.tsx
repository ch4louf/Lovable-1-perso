import React from 'react';
import Dashboard from '../components/Dashboard';

interface DashboardPageProps {
  onAction?: (type: 'RUN' | 'PROCESS', id: string) => void;
  onNavigate?: (tab: string) => void;
}

export default function DashboardPage({ onAction, onNavigate }: DashboardPageProps) {
  const handleAction = onAction || (() => {});
  const handleNavigate = onNavigate || (() => {});
  
  return (
    <Dashboard onAction={handleAction} onNavigate={handleNavigate} />
  );
}
