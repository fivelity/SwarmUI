import { useState } from "react";
import { useResourceStore } from "@/stores/useResourceStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download, X, CheckCircle, AlertCircle } from "lucide-react";

export function ModelDownloader() {
    const { downloads, startDownload, cancelDownload } = useResourceStore();
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("checkpoint");

    const handleDownload = () => {
        if (!url || !name) return;
        startDownload(url, name, type);
        setUrl("");
        setName("");
    };

    return (
        <div className="space-y-6">
            <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Model
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Model URL</Label>
                        <Input 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://civitai.com/api/download/models/..." 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Save As (Filename)</Label>
                        <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="my_model.safetensors" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="checkpoint">Checkpoint (Model)</SelectItem>
                                <SelectItem value="lora">LoRA</SelectItem>
                                <SelectItem value="embedding">Embedding</SelectItem>
                                <SelectItem value="vae">VAE</SelectItem>
                                <SelectItem value="controlnet">ControlNet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button className="w-full" onClick={handleDownload} disabled={!url || !name}>
                            Start Download
                        </Button>
                    </div>
                </div>
            </Card>

            {downloads.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Active Downloads</h4>
                    {downloads.map((task) => (
                        <Card key={task.id} className="p-4 flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{task.name}</span>
                                    <span className="text-muted-foreground uppercase text-xs">{task.type}</span>
                                </div>
                                <Progress value={task.progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{task.status === 'downloading' ? `${task.progress}%` : task.status}</span>
                                    {task.error && <span className="text-destructive">{task.error}</span>}
                                </div>
                            </div>
                            
                            <div className="shrink-0">
                                {task.status === 'completed' ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : task.status === 'error' ? (
                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                ) : (
                                    <Button size="icon" variant="ghost" onClick={() => cancelDownload(task.id)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
