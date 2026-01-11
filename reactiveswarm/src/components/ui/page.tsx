import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('container mx-auto p-3 sm:p-4 lg:p-6', className)}>{children}</div>;
}

interface PageSurfaceProps {
  children: ReactNode;
  className?: string;
}

export function PageSurface({ children, className }: PageSurfaceProps) {
  return <div className={cn('p-2 sm:p-3 lg:p-4', className)}>{children}</div>;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({ title, description, actions, icon: Icon, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-start md:justify-between', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-7 w-7 text-primary" /> : null}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

interface PanelHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PanelHeader({ title, description, actions, className }: PanelHeaderProps) {
  return (
    <div className={cn('p-4 border-b border-border/50', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {typeof title === 'string' ? (
            <h3 className="font-semibold text-sm truncate">{title}</h3>
          ) : (
            <div className="font-semibold text-sm min-w-0">{title}</div>
          )}
          {description ? (
            typeof description === 'string' ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : (
              <div className="text-xs text-muted-foreground min-w-0">{description}</div>
            )
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          {Icon ? <Icon className="h-8 w-8 text-muted-foreground" /> : null}
          <div className="space-y-1">
            <div className="text-sm font-medium">{title}</div>
            {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
          </div>
          {action ? <div className="pt-2">{action}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface LoadingStateProps {
  title?: string;
  lines?: number;
  className?: string;
}

export function LoadingState({ title = 'Loading…', lines = 3, className }: LoadingStateProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: Math.max(1, lines) }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

interface ErrorStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function ErrorState({ title, description, className }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  );
}
