import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Trash2, 
  Play,
  Square,
  Settings,
  Monitor,
  Cpu
} from 'lucide-react';
import { 
  listWorkflows, 
  getGeneratedWorkflow,
  sendMessageToComfyUI,
  listenToComfyUIMessages,
  type WorkflowListItem 
} from '@/services/comfyApi';

export const ComfyWorkflowTab = () => {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [multiGPUMode, setMultiGPUMode] = useState('');
  const [quickLoadWorkflow, setQuickLoadWorkflow] = useState('');
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);

  useEffect(() => {
    // Initialize the ComfyUI iframe when component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
    }, 1000);

    // Load available workflows
    loadWorkflows();

    // Set up message listener for ComfyUI iframe communication
    const cleanup = listenToComfyUIMessages((event) => {
      // Handle messages from ComfyUI iframe
      console.log('Message from ComfyUI:', event.data);
    });

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  const loadWorkflows = async () => {
    setLoadingWorkflows(true);
    try {
      const workflowList = await listWorkflows();
      setWorkflows(workflowList);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      toast.error(t('Failed to load workflows'));
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
  };

  const handleUseWorkflow = async () => {
    try {
      if (iframeRef.current) {
        // Send message to ComfyUI iframe to get current workflow
        sendMessageToComfyUI(iframeRef.current, { type: 'get_workflow' });
      }
      toast.success(t('Workflow will be used in Generate tab'));
    } catch (error) {
      console.error('Failed to use workflow:', error);
      toast.error(t('Failed to use workflow'));
    }
  };

  const handleSaveWorkflow = () => {
    if (iframeRef.current) {
      // Send message to ComfyUI iframe to trigger save workflow dialog
      sendMessageToComfyUI(iframeRef.current, { type: 'save_workflow' });
    }
  };

  const handleBrowseWorkflows = () => {
    if (iframeRef.current) {
      // Send message to ComfyUI iframe to show workflow browser
      sendMessageToComfyUI(iframeRef.current, { type: 'browse_workflows' });
    }
  };

  const handleImportFromGenerate = async () => {
    try {
      const generatedWorkflow = await getGeneratedWorkflow();
      if (iframeRef.current && generatedWorkflow) {
        // Send the generated workflow to ComfyUI iframe
        sendMessageToComfyUI(iframeRef.current, { 
          type: 'import_workflow', 
          workflow: generatedWorkflow 
        });
        toast.success(t('Workflow imported from Generate tab'));
      }
    } catch (error) {
      console.error('Failed to import workflow:', error);
      toast.error(t('Failed to import workflow from Generate tab'));
    }
  };

  const handleRemoveWorkflow = () => {
    if (iframeRef.current) {
      // Send message to ComfyUI iframe to remove workflow
      sendMessageToComfyUI(iframeRef.current, { type: 'remove_workflow' });
      toast.success(t('Workflow removed from Generate tab'));
    }
  };

  const handleMultiGPUChange = (value: string) => {
    setMultiGPUMode(value);
    // TODO: Implement multi-GPU configuration
    console.log('Multi-GPU mode:', value);
  };

  const handleQuickLoadChange = async (value: string) => {
    setQuickLoadWorkflow(value);
    if (value && iframeRef.current) {
      try {
        // Load the selected workflow and send it to ComfyUI iframe
        const workflow = workflows.find(w => w.name === value);
        if (workflow) {
          sendMessageToComfyUI(iframeRef.current, { 
            type: 'load_workflow', 
            workflowName: value 
          });
          toast.success(t('Workflow loaded: {{name}}', { name: workflow.name }));
        }
      } catch (error) {
        console.error('Failed to quick load workflow:', error);
        toast.error(t('Failed to load workflow'));
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Control Buttons */}
      {buttonsVisible && (
        <Card className="m-4 mb-2 flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleUseWorkflow}
                  className="bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {t('Use This Workflow In Generate Tab')}
                </Button>
                
                <Button 
                  onClick={handleSaveWorkflow}
                  variant="outline"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('Save Workflow')}
                </Button>
                
                <Button 
                  onClick={handleBrowseWorkflows}
                  variant="outline"
                  size="sm"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  {t('Browse Workflows')}
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleImportFromGenerate}
                  variant="outline"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('Import From Generate Tab')}
                </Button>
                
                <Button 
                  onClick={handleRemoveWorkflow}
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('Remove Workflow From Generate Tab')}
                </Button>
              </div>

              {/* Configuration Controls */}
              <div className="flex gap-2 ml-auto">
                <Select value={multiGPUMode} onValueChange={handleMultiGPUChange}>
                  <SelectTrigger className="w-40">
                    <Cpu className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t('MultiGPU')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('-- MultiGPU --')}</SelectItem>
                    <SelectItem value="all">{t('Use All')}</SelectItem>
                    <SelectItem value="reserve">{t('Reserve Exclusive')}</SelectItem>
                    <SelectItem value="none">{t('Use One')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={quickLoadWorkflow} onValueChange={handleQuickLoadChange}>
                  <SelectTrigger className="w-40">
                    <Download className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t('Quick Load')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('-- Quick Load --')}</SelectItem>
                    {loadingWorkflows ? (
                      <SelectItem value="" disabled>{t('Loading...')}</SelectItem>
                    ) : (
                      workflows.map(workflow => (
                        <SelectItem key={workflow.name} value={workflow.name}>
                          {workflow.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setButtonsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Button when hidden */}
      {!buttonsVisible && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setButtonsVisible(true)}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ComfyUI Iframe Container */}
      <div className="flex-1 relative bg-card border border-border rounded-lg mx-4 mb-4 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">{t('Loading ComfyUI Workflow Editor...')}</p>
            </div>
          </div>
        )}
        
        {!isLoaded && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center space-y-4 max-w-md mx-auto p-6">
              <Monitor className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-semibold">{t('ComfyUI Workflow Editor')}</h2>
              <p className="text-muted-foreground">
                {t('Seems like the ComfyUI workflow editor direct-access hasn\'t loaded. Give it a second to load, or try clicking the "Comfy Workflow" tab header - if it doesn\'t load, there might be an error message in your browser console or the server logs.')}
              </p>
              <Button onClick={() => setIsLoaded(true)} className="mt-4">
                {t('Try Loading Again')}
              </Button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="/ComfyBackendDirect/"
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          style={{ display: isLoaded ? 'block' : 'none' }}
          title="ComfyUI Workflow Editor"
        />
      </div>
    </div>
  );
};
