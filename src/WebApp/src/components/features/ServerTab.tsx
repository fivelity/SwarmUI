import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackendsPanel } from './panels/BackendsPanel';
import { ExtensionsPanel } from './panels/ExtensionsPanel';
import { ServerInfoPanel } from './panels/ServerInfoPanel';
import { ServerConfigurationPanel } from './panels/ServerConfigurationPanel';
import { UserManagementPanel } from './panels/UserManagementPanel';
import { LogsPanel } from './panels/LogsPanel';

export const ServerTab = () => {
    const { t } = useTranslation();
    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList>
                <TabsTrigger value="info">{t('Server Info')}</TabsTrigger>
                <TabsTrigger value="backends">{t('Backends')}</TabsTrigger>
                <TabsTrigger value="config">{t('Server Configuration')}</TabsTrigger>
                <TabsTrigger value="users">{t('Users')}</TabsTrigger>
                <TabsTrigger value="extensions">{t('Extensions')}</TabsTrigger>
                <TabsTrigger value="logs">{t('Logs')}</TabsTrigger>
            </TabsList>
            <TabsContent value="info"><ServerInfoPanel /></TabsContent>
            <TabsContent value="backends"><BackendsPanel /></TabsContent>
            <TabsContent value="config"><ServerConfigurationPanel /></TabsContent>
            <TabsContent value="users"><UserManagementPanel /></TabsContent>
            <TabsContent value="extensions"><ExtensionsPanel /></TabsContent>
            <TabsContent value="logs"><LogsPanel /></TabsContent>
        </Tabs>
    );
};