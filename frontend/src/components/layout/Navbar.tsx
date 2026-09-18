'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Search, Bell, Moon, Sun, User, Menu, X, Command } from 'lucide-react';
import { NAV_ITEMS, BRAND } from '@/lib/constants';
import { CommandSearchModal } from './CommandSearchModal';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCyberTheme, setIsCyberTheme] = useState(true);

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[72px] bg-surface/85 backdrop-blur-xl border-b border-border/80 flex items-center justify-between px-4 lg:px-6 transition-all">
        {/* Left: Logo + Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-text-muted hover:text-text rounded-xl hover:bg-surface-2 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/home" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-dark to-surface-2 border border-primary-bright/40 shadow-glass-glow group-hover:border-cyber-cyan/60 group-hover:shadow-cyan-glow transition-all duration-300">
              <Shield className="w-5 h-5 text-white cyber-shield-glow" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyber-cyan" />
            </div>

            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-wider text-text uppercase">
                  {BRAND.name}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold bg-cyber-cyan/15 text-cyber-cyan rounded border border-cyber-cyan/30">
                  PHASE 4
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-medium tracking-wide">
                {BRAND.tagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-2/70 p-1.5 rounded-full border border-border/70 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-text-muted hover:text-text hover:bg-surface-3/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-bright border border-cyber-cyan/40 shadow-glass-glow -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Global Search Button / Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-surface-2/80 border border-border/80 hover:border-primary-bright/50 px-3 py-1.5 text-xs text-text-muted hover:text-text transition-all duration-200"
            title="Global Threat Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-primary-bright" />
            <span className="hidden md:inline text-xs font-medium">Search threats...</span>
            <span className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-surface-3 text-[10px] font-mono text-text-muted border border-border/60">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen((prev) => !prev);
                setIsProfileOpen(false);
              }}
              className={`relative p-2 rounded-xl bg-surface-2/70 border transition-all ${
                isNotificationOpen
                  ? 'border-cyber-cyan text-cyber-cyan shadow-cyan-glow'
                  : 'border-border/80 text-text-muted hover:text-text hover:border-primary-bright/40'
              }`}
              aria-label="Threat Notifications"
              title="Security Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-danger animate-pulse" />
            </button>

            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          {/* Theme Control Toggle (Visual Cyber Switch) */}
          <button
            onClick={() => setIsCyberTheme((prev) => !prev)}
            className="p-2 rounded-xl bg-surface-2/70 border border-border/80 text-text-muted hover:text-text hover:border-primary-bright/40 transition-colors"
            aria-label="Toggle Theme Mode"
            title={`Active Theme: ${isCyberTheme ? 'Cyber Deep Navy (Recommended)' : 'Cyber Matrix Dark'}`}
          >
            {isCyberTheme ? (
              <Moon className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <Sun className="w-4 h-4 text-cyber-warning" />
            )}
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsNotificationOpen(false);
              }}
              className={`flex items-center gap-2 pl-1 sm:pl-2 border-l border-border/60 focus:outline-none p-1 rounded-xl transition-all ${
                isProfileOpen ? 'bg-surface-2/80' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-surface-3 to-primary-dark border border-primary-bright/30 flex items-center justify-center text-text shadow-glass">
                <User className="w-4 h-4 text-primary-bright" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-text leading-tight">SecOps Admin</span>
                <span className="text-[10px] text-cyber-success font-mono">SOC Active</span>
              </div>
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      </header>

      {/* Global Command Search Modal */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
