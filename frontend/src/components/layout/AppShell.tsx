'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';

interface AppShellProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize collapse preference from localStorage
  useEffect(() => {
    try {
      const savedCollapse = localStorage.getItem('phishguard_sidebar_collapsed');
      if (savedCollapse !== null) {
        setIsSidebarCollapsed(savedCollapse === 'true');
      }
    } catch {
      // localStorage may fail in restricted environments
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('phishguard_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // If public landing page or auth page, render clean layout without internal SOC sidebar & header
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col cyber-bg-grid selection:bg-primary selection:text-white relative overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col cyber-bg-grid selection:bg-primary selection:text-white">
      {/* Internal Application Navbar */}
      <Navbar
        onToggleSidebar={() => setIsMobileDrawerOpen((prev) => !prev)}
        isSidebarOpen={isMobileDrawerOpen}
      />

      {/* Main Area: Internal SOC Sidebar + Page Content with Transition */}
      <div className="flex-1 flex w-full relative">
        <Sidebar
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <main className="flex-1 min-w-0 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
};
