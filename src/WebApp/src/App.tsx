import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/core/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { GenerateTab } from './components/features/GenerateTab';
import { SimpleTab } from './components/features/SimpleTab';
import { UtilitiesTab } from './components/features/UtilitiesTab';
import { UserTab } from './components/features/UserTab';
import { ServerTab } from './components/features/ServerTab';
import { StatusBar } from './components/core/StatusBar';
import { Tools } from './components/core/Tools';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="bg-background text-text min-h-screen p-4 pb-12"> {/* Add padding-bottom to avoid content overlap */}
            <div className="flex gap-4">
                <Tools />
                <Tabs defaultValue="generate" className="w-full">
                    <TabsList>
                        <TabsTrigger value="generate">{t('Generate')}</TabsTrigger>
                        <TabsTrigger value="simple">{t('Simple')}</TabsTrigger>
                        <TabsTrigger value="utilities">{t('Utilities')}</TabsTrigger>
                        <TabsTrigger value="user">{t('User')}</TabsTrigger>
                        <TabsTrigger value="server">{t('Server')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generate"><GenerateTab /></TabsContent>
                    <TabsContent value="simple"><SimpleTab /></TabsContent>
                    <TabsContent value="utilities"><UtilitiesTab /></TabsContent>
                    <TabsContent value="user"><UserTab /></TabsContent>
                    <TabsContent value="server"><ServerTab /></TabsContent>
                </Tabs>
            </div>
        </div>
        <StatusBar />
        <Toaster />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;