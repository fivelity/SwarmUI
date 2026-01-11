import { useMemo } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Cpu,
  Grid,
  Wrench,
  Box,
} from 'lucide-react';

import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useGenerationStore } from '@/stores/generationStore';
import { useJobStore } from '@/stores/jobStore';

type NavTab = ReturnType<typeof useUIStore.getState>["activeTab"]; // keeps in sync without any

const navItems: Array<{ id: NavTab; label: string; icon: typeof Sparkles }> = [
  { id: 'generate' as NavTab, label: 'Generate', icon: Sparkles },
  { id: 'grid' as NavTab, label: 'Grid', icon: Grid },
  { id: 'tools' as NavTab, label: 'Tools', icon: Wrench },
  { id: 'comfy' as NavTab, label: 'ComfyUI', icon: Cpu },
  { id: 'extensions' as NavTab, label: 'Extensions', icon: Box },
  { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isGenerating = useGenerationStore((s) => s.isGenerating);
  const jobs = useJobStore((s) => s.jobs);

  const activeJobs = useMemo(() => {
    let count = 0;
    jobs.forEach((j) => {
      if (j.status === 'running' || j.status === 'queued') count += 1;
    });
    return count;
  }, [jobs]);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                onClick={() => setActiveTab('generate' as NavTab)}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary">
                  <span className="text-xs font-mono font-bold">RS</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">REACTIVESWARM</span>
                  <span className="truncate text-xs">PROTOCOL V2.1</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>

                    {item.id === ('generate' as NavTab) && isGenerating && activeJobs > 0 && (
                      <SidebarMenuBadge>{activeJobs}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <User className="size-4" />
                    <span className="truncate">{user?.username ?? 'Guest'}</span>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {user?.username ?? 'Guest'}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setActiveTab('settings' as NavTab)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 cursor-pointer text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
