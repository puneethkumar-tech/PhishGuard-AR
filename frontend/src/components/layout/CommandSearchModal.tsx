'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Shield, Command, Tag, FileText, Cpu } from 'lucide-react';
import { DEMO_SEARCH_ITEMS } from '@/lib/demo-data';
import { SearchItem } from '@/types';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Navigation: <Shield className="w-4 h-4 text-primary-bright" />,
  'Threat Vector': <Tag className="w-4 h-4 text-cyber-danger" />,
  'Security Report': <FileText className="w-4 h-4 text-cyber-violet" />,
  'Model Architecture': <Cpu className="w-4 h-4 text-cyber-cyan" />,
};

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from outside
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = query.trim()
    ? DEMO_SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : DEMO_SEARCH_ITEMS;

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.href);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-2xl bg-surface/95 border border-border shadow-2xl overflow-hidden backdrop-blur-2xl z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/70 bg-surface-2/40">
            <Search className="w-5 h-5 text-primary-bright flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search threat vectors, tools, reports, architecture..."
              className="w-full bg-transparent text-sm text-text placeholder-text-muted focus:outline-none font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-3"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-3 text-[10px] font-mono text-text-muted border border-border/80">
              <Command className="w-3 h-3" />
              <span>ESC</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-text">No threat or tool results found</p>
                <p className="text-xs text-text-muted mt-1">
                  Try searching for &quot;phishing&quot;, &quot;scan&quot;, &quot;robustness&quot;, or &quot;homoglyph&quot;.
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const icon = CATEGORY_ICON_MAP[item.category] || <Shield className="w-4 h-4 text-primary" />;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary/20 via-surface-2 to-surface-2 border border-cyber-cyan/40 shadow-cyan-glow text-text'
                        : 'text-text-muted hover:text-text hover:bg-surface-2/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-surface-2 border border-border">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-primary/20 text-primary-bright border border-primary-bright/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-text-muted hidden sm:inline">
                        {item.category}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyber-cyan' : 'text-text-muted'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Helper */}
          <div className="flex items-center justify-between px-4 py-2 bg-surface-2/60 border-t border-border/70 text-[10px] font-mono text-text-muted">
            <div className="flex items-center gap-3">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to dismiss</span>
            </div>
            <span className="text-cyber-cyan">Phase 2 Global Index</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
