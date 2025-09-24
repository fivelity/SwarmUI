import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/core/ProtectedRoute';
import { HeaderLayout } from './components/layout/HeaderLayout';
import { useTranslation } from 'react-i18next';
import { GenerateTab } from './components/features/GenerateTab';
import { SimpleTab } from './components/features/SimpleTab';
import { UtilitiesTab } from './components/features/UtilitiesTab';
import { UserTab } from './components/features/UserTab';
import { ServerTab } from './components/features/ServerTab';
import { ComfyWorkflowTab } from './components/features/ComfyWorkflowTab';
import { StatusBar } from './components/core/StatusBar';
import { Toaster } from '@/components/ui/sonner';
import { 
  Sparkles, 
  Zap, 
  Wrench, 
  User, 
  Server,
  Image,
  Settings,
  Palette,
  Download,
  Database,
  Shield,
  Activity,
  FileText,
  Layers,
  Sliders,
  Workflow
} from 'lucide-react';

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('generate');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>('basic');

  const tabs = [
    {
      id: 'generate',
      label: t('Generate'),
      icon: <Sparkles className="h-4 w-4" />,
      subtabs: [
        { id: 'basic', label: t('Basic'), icon: <Image className="h-4 w-4" /> },
        { id: 'advanced', label: t('Advanced'), icon: <Sliders className="h-4 w-4" /> },
        { id: 'batch', label: t('Batch'), icon: <Layers className="h-4 w-4" /> }
      ]
    },
    {
      id: 'simple',
      label: t('Simple'),
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: 'comfy-workflow',
      label: t('Comfy Workflow'),
      icon: <Workflow className="h-4 w-4" />
    },
    {
      id: 'utilities',
      label: t('Utilities'),
      icon: <Wrench className="h-4 w-4" />,
      subtabs: [
        { id: 'tools', label: t('Tools'), icon: <Wrench className="h-4 w-4" /> },
        { id: 'models', label: t('Models'), icon: <Database className="h-4 w-4" /> },
        { id: 'downloads', label: t('Downloads'), icon: <Download className="h-4 w-4" /> }
      ]
    },
    {
      id: 'user',
      label: t('User'),
      icon: <User className="h-4 w-4" />,
      subtabs: [
        { id: 'profile', label: t('Profile'), icon: <User className="h-4 w-4" /> },
        { id: 'preferences', label: t('Preferences'), icon: <Settings className="h-4 w-4" /> },
        { id: 'themes', label: t('Themes'), icon: <Palette className="h-4 w-4" /> }
      ]
    },
    {
      id: 'server',
      label: t('Server'),
      icon: <Server className="h-4 w-4" />,
      subtabs: [
        { id: 'status', label: t('Status'), icon: <Activity className="h-4 w-4" /> },
        { id: 'config', label: t('Configuration'), icon: <Settings className="h-4 w-4" /> },
        { id: 'logs', label: t('Logs'), icon: <FileText className="h-4 w-4" /> },
        { id: 'users', label: t('Users'), icon: <Shield className="h-4 w-4" /> }
      ]
    }
  ];

  const handleTabChange = (tabId: string, subTabId?: string) => {
    setActiveTab(tabId);
    setActiveSubTab(subTabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return <GenerateTab activeSubTab={activeSubTab} />;
      case 'simple':
        return <SimpleTab />;
      case 'comfy-workflow':
        return <ComfyWorkflowTab />;
      case 'utilities':
        return <UtilitiesTab activeSubTab={activeSubTab} />;
      case 'user':
        return <UserTab activeSubTab={activeSubTab} />;
      case 'server':
        return <ServerTab activeSubTab={activeSubTab} />;
      default:
        return <GenerateTab activeSubTab={activeSubTab} />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <HeaderLayout
          tabs={tabs}
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          onTabChange={handleTabChange}
        >
          <div className="h-full w-full bg-background">
            {renderTabContent()}
          </div>
        </HeaderLayout>
        <StatusBar />
        <Toaster />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;