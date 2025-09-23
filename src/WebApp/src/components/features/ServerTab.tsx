import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackendsPanel } from './panels/BackendsPanel';
import { ExtensionsPanel } from './panels/ExtensionsPanel';
import { ServerInfoPanel } from './panels/ServerInfoPanel';
import { ServerConfigurationPanel } from './panels/ServerConfigurationPanel';
import { UserManagementPanel } from './panels/UserManagementPanel';
import { LogsPanel } from './panels/LogsPanel';

export const ServerTab = () => {
    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList>
                <TabsTrigger value="info">Server Info</TabsTrigger>
                <TabsTrigger value="backends">Backends</TabsTrigger>
                <TabsTrigger value="config">Server Configuration</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="extensions">Extensions</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
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