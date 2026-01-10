import { useState, useEffect } from "react";
import { useResourceStore } from "@/stores/resourceStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Save, Trash2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function WildcardManager() {
    const { wildcards, fetchWildcards, saveWildcard, deleteWildcard } = useResourceStore();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState("");
    const [newFileName, setNewFileName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchWildcards();
    }, [fetchWildcards]);

    const handleSelect = (name: string, content: string) => {
        setSelectedFile(name);
        setEditorContent(content);
        setIsCreating(false);
    };

    const handleSave = async () => {
        if (!selectedFile && !newFileName) return;
        const name = selectedFile || (newFileName.endsWith('.txt') ? newFileName : `${newFileName}.txt`);
        
        await saveWildcard(name, editorContent);
        toast.success(`Saved ${name}`);
        
        if (isCreating) {
            setSelectedFile(name);
            setIsCreating(false);
            setNewFileName("");
        }
    };

    const handleDelete = async (name: string) => {
        await deleteWildcard(name);
        if (selectedFile === name) {
            setSelectedFile(null);
            setEditorContent("");
        }
        toast.success(`Deleted ${name}`);
    };

    return (
        <div className="grid grid-cols-12 gap-4 h-[600px]">
            {/* Sidebar List */}
            <div className="col-span-4 border border-border rounded-lg bg-card flex flex-col overflow-hidden">
                <div className="p-3 border-b border-border flex items-center justify-between">
                    <span className="font-semibold text-sm">Wildcards</span>
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => fetchWildcards()}>
                            <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
                            setIsCreating(true);
                            setSelectedFile(null);
                            setEditorContent("");
                        }}>
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {wildcards.map((file) => (
                            <div 
                                key={file.name}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm ${selectedFile === file.name ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                                onClick={() => handleSelect(file.name, file.content)}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                </div>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(file.name);
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Editor Area */}
            <div className="col-span-8 flex flex-col gap-4">
                {(selectedFile || isCreating) ? (
                    <Card className="flex-1 flex flex-col p-0 overflow-hidden">
                        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/20">
                            {isCreating ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">New File:</span>
                                    <Input 
                                        value={newFileName}
                                        onChange={(e) => setNewFileName(e.target.value)}
                                        placeholder="animals"
                                        className="h-7 w-48"
                                    />
                                    <span className="text-muted-foreground text-sm">.txt</span>
                                </div>
                            ) : (
                                <span className="font-mono text-sm font-medium">{selectedFile}</span>
                            )}
                            <Button size="sm" onClick={handleSave}>
                                <Save className="w-3 h-3 me-2" />
                                Save
                            </Button>
                        </div>
                        <Textarea 
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                            className="flex-1 resize-none rounded-none border-0 focus-visible:ring-0 font-mono text-sm p-4"
                            placeholder="Enter wildcard options, one per line..."
                        />
                    </Card>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                        Select or create a wildcard file
                    </div>
                )}
            </div>
        </div>
    );
}
