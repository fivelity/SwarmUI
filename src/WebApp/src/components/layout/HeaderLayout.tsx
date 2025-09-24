import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SubTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  subtabs?: SubTab[];
}

interface HeaderLayoutProps {
  tabs: Tab[];
  activeTab: string;
  activeSubTab?: string;
  onTabChange: (tabId: string, subTabId?: string) => void;
  children: React.ReactNode;
}

export const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  tabs,
  activeTab,
  activeSubTab,
  onTabChange,
  children
}) => {
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set([activeTab]));

  const toggleTabExpansion = (tabId: string) => {
    const newExpanded = new Set(expandedTabs);
    if (newExpanded.has(tabId)) {
      newExpanded.delete(tabId);
    } else {
      newExpanded.add(tabId);
    }
    setExpandedTabs(newExpanded);
  };

  const handleTabClick = (tab: Tab) => {
    if (tab.subtabs && tab.subtabs.length > 0) {
      toggleTabExpansion(tab.id);
      // If clicking on a tab with subtabs, activate the first subtab
      if (!expandedTabs.has(tab.id)) {
        onTabChange(tab.id, tab.subtabs[0].id);
      }
    } else {
      onTabChange(tab.id);
    }
  };

  const handleSubTabClick = (tabId: string, subTabId: string) => {
    onTabChange(tabId, subTabId);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Header Navigation */}
      <header className="bg-card border-b border-border shadow-sm flex-shrink-0">
        <div className="flex h-16 w-full overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isExpanded = expandedTabs.has(tab.id);
            const hasSubtabs = tab.subtabs && tab.subtabs.length > 0;

            return (
              <div key={tab.id} className="relative">
                {/* Main Tab Button */}
                <button
                  onClick={() => handleTabClick(tab)}
                  className={cn(
                    "flex items-center gap-2 px-6 h-16 text-sm font-medium transition-all duration-200 border-r border-border/50",
                    "hover:bg-accent/10 hover:text-accent-foreground",
                    isActive 
                      ? "bg-primary/10 text-primary border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {hasSubtabs && (
                    <div className="ml-1">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Subtabs Dropdown */}
                {hasSubtabs && isExpanded && (
                  <div className="absolute top-16 left-0 z-50 bg-card border border-border shadow-lg rounded-b-md min-w-48">
                    {tab.subtabs!.map((subtab) => {
                      const isSubActive = activeTab === tab.id && activeSubTab === subtab.id;
                      
                      return (
                        <button
                          key={subtab.id}
                          onClick={() => handleSubTabClick(tab.id, subtab.id)}
                          className={cn(
                            "flex items-center gap-2 w-full px-4 py-3 text-sm transition-colors",
                            "hover:bg-accent/10 hover:text-accent-foreground",
                            "border-b border-border/30 last:border-b-0",
                            isSubActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {subtab.icon}
                          <span>{subtab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
