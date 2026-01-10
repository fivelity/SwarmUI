import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WildcardManager } from "./WildcardManager";
import { ModelDownloader } from "./ModelDownloader";
import { ModelBrowser } from "@/components/models/ModelBrowser";
import { BackendTelemetry } from "./BackendTelemetry";
import { FileText, Download, Wrench, Folder, Activity } from "lucide-react";

export function ToolsPage() {
  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Tools & Resources</h2>
                <p className="text-muted-foreground">Manage wildcards, models, and monitor system resources.</p>
            </div>

            <Tabs defaultValue="models" className="w-full">
                <TabsList className="grid w-full grid-cols-5 max-w-[750px]">
                    <TabsTrigger value="models" className="flex gap-2">
                        <Folder className="w-4 h-4" />
                        Models
                    </TabsTrigger>
                    <TabsTrigger value="wildcards" className="flex gap-2">
                        <FileText className="w-4 h-4" />
                        Wildcards
                    </TabsTrigger>
                    <TabsTrigger value="downloader" className="flex gap-2">
                        <Download className="w-4 h-4" />
                        Downloader
                    </TabsTrigger>
                    <TabsTrigger value="telemetry" className="flex gap-2">
                        <Activity className="w-4 h-4" />
                        Telemetry
                    </TabsTrigger>
                    <TabsTrigger value="utilities" className="flex gap-2">
                        <Wrench className="w-4 h-4" />
                        Utilities
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="models" className="h-[600px]">
                        <ModelBrowser />
                    </TabsContent>

                    <TabsContent value="wildcards">
                        <WildcardManager />
                    </TabsContent>
                    
                    <TabsContent value="downloader">
                        <ModelDownloader />
                    </TabsContent>

                    <TabsContent value="telemetry">
                        <BackendTelemetry />
                    </TabsContent>

                    <TabsContent value="utilities">
                        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                            Utility tools (Image Metadata Reader, Tokenizer Debugger) coming soon.
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    </div>
  );
}
