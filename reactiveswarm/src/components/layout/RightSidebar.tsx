import { useEffect } from "react";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useUIStore } from "@/stores/useUIStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Folder, Star, CheckSquare, Trash2, X, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export function RightSidebar() {
  // const { rightSidebarCollapsed } = useLayoutStore(); // Not used directly
  const { setEditingImage } = useUIStore();
  const { 
      images, 
      isLoading,
      selectionMode, 
      selectedImageIds, 
      setSelectionMode, 
      toggleSelection, 
      removeImages,
      selectImage,
      fetchImages
  } = useHistoryStore();

  useEffect(() => {
    fetchImages({ path: "", depth: 4, sortBy: "Date", sortReverse: true });
  }, [fetchImages]);

  // if (rightSidebarCollapsed) return null;

  const handleImageClick = (id: string) => {
      if (selectionMode) {
          toggleSelection(id);
      } else {
          selectImage(id);
          // TODO: Open image viewer/modal
      }
  };

  const handleEdit = (e: React.MouseEvent, imageUrl: string) => {
      e.stopPropagation();
      setEditingImage(imageUrl);
  };

  const handleDeleteSelected = () => {
      removeImages(selectedImageIds);
      setSelectionMode(false);
  };

  return (
    <div className="h-full w-full bg-card flex flex-col">
       <Tabs defaultValue="gallery" className="flex-1 flex flex-col">
            <div className="p-2 border-b border-border flex flex-col gap-2">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="gallery" className="flex gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span className="hidden xl:inline">Gallery</span>
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="flex gap-2">
                        <Star className="w-4 h-4" />
                        <span className="hidden xl:inline">Starred</span>
                    </TabsTrigger>
                    <TabsTrigger value="folders" className="flex gap-2">
                        <Folder className="w-4 h-4" />
                        <span className="hidden xl:inline">Folders</span>
                    </TabsTrigger>
                </TabsList>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-1 h-8">
                    <div className="text-xs text-muted-foreground">
                        {selectionMode ? `${selectedImageIds.length} selected` : `${images.length} images`}
                    </div>
                    <div className="flex items-center gap-1">
                        {selectionMode ? (
                            <>
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={handleDeleteSelected}
                                    disabled={selectedImageIds.length === 0}
                                    title="Delete Selected"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => setSelectionMode(false)}
                                    title="Cancel Selection"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </>
                        ) : (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => setSelectionMode(true)}
                                title="Select Multiple"
                            >
                                <CheckSquare className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <TabsContent value="gallery" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-2 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        {isLoading ? (
                             <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">Loading images...</p>
                             </div>
                        ) : images.length === 0 ? (
                             <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No images generated yet.</p>
                             </div>
                        ) : (
                            images.map((img) => (
                                <Card 
                                    key={img.id} 
                                    className={cn(
                                        "aspect-square overflow-hidden group relative cursor-pointer border-0 rounded-md transition-all",
                                        selectionMode && selectedImageIds.includes(img.id) && "ring-2 ring-primary ring-offset-2 ring-offset-card scale-95"
                                    )}
                                    onClick={() => handleImageClick(img.id)}
                                >
                                    <img 
                                        src={img.thumbnailUrl || img.url} 
                                        alt={img.prompt} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                        loading="lazy"
                                    />
                                    {/* Selection Overlay */}
                                    {selectionMode && (
                                        <div className={cn(
                                            "absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity",
                                            selectedImageIds.includes(img.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
                                                selectedImageIds.includes(img.id) ? "bg-primary border-primary" : "bg-black/50"
                                            )}>
                                                {selectedImageIds.includes(img.id) && <CheckSquare className="w-3 h-3 text-primary-foreground" />}
                                            </div>
                                        </div>
                                    )}

                                    {/* Star Badge (only show if not in selection mode or if starred) */}
                                    {img.isStarred && (
                                        <div className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-yellow-500">
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                    )}
                                    
                                    {/* Actions Overlay (Hover) */}
                                    {!selectionMode && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button 
                                                size="icon" 
                                                variant="secondary" 
                                                className="h-8 w-8 rounded-full"
                                                onClick={(e) => handleEdit(e, img.url)}
                                                title="Edit / Inpaint"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            ))
                        )}
                        
                        {/* Placeholders removed for cleaner logic */}
                    </div>
                </ScrollArea>
            </TabsContent>
            
            <TabsContent value="starred" className="flex-1 m-0 p-4 text-center text-muted-foreground">
                <p>Starred images will appear here.</p>
            </TabsContent>

            <TabsContent value="folders" className="flex-1 m-0 p-4 text-center text-muted-foreground">
                <p>Folder browser coming soon.</p>
            </TabsContent>
       </Tabs>
    </div>
  );
}
