import { useModelStore } from "@/stores/modelStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, FolderOpen } from "lucide-react";

export function ModelTree() {
  const folders = useModelStore((state) => state.folders);
  const selectedFolder = useModelStore((state) => state.selectedFolder);
  const setSelectedFolder = useModelStore((state) => state.setSelectedFolder);

  return (
    <div className="w-48 border-e border-border h-full flex flex-col bg-muted/10">
      <div className="p-3 border-b border-border font-semibold text-sm">
        Folders
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {folders.map((folder) => {
            const isSelected = selectedFolder === folder;
            const displayName = folder === "/" ? "Root" : folder.replace("/", "");
            return (
              <Button
                key={folder}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 h-8 font-normal",
                  isSelected && "bg-accent text-accent-foreground font-medium"
                )}
                onClick={() => setSelectedFolder(folder)}
              >
                {isSelected ? (
                    <FolderOpen className="w-4 h-4 text-primary" />
                ) : (
                    <Folder className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="truncate">{displayName}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
