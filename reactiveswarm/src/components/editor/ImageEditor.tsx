import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
    Eraser, 
    Brush, 
    ZoomIn, 
    ZoomOut, 
    Undo, 
    Redo, 
    Save, 
    X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (maskDataUrl: string) => void;
}

export function ImageEditor({ imageUrl, isOpen, onClose, onSave }: ImageEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [brushOpacity, setBrushOpacity] = useState(1.0);
    const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
    const [scale, setScale] = useState(1);
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const saveState = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setHistory(prev => {
                const newHistory = prev.slice(0, historyIndex + 1);
                newHistory.push(imageData);
                return newHistory;
            });
            setHistoryIndex(prev => prev + 1);
        }
    }, [historyIndex]);

    // Initialize Canvas
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            // Clear history on new image load
            setHistory([]);
            setHistoryIndex(-1);
            // Save initial state
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([imageData]);
            setHistoryIndex(0);
        };
    }, [isOpen, imageUrl]);

    const undo = () => {
        if (historyIndex > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                const prevState = history[historyIndex - 1];
                ctx.putImageData(prevState, 0, 0);
                setHistoryIndex(historyIndex - 1);
            }
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                const nextState = history[historyIndex + 1];
                ctx.putImageData(nextState, 0, 0);
                setHistoryIndex(historyIndex + 1);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveState();
        }
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath(); // Reset path
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        // Map coordinates from client space to canvas space
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineWidth = brushSize; // Brush size relative to canvas pixels
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1.0; 
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = brushOpacity;
            ctx.strokeStyle = 'white'; 
            ctx.fillStyle = 'white';
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleSave = () => {
        if (canvasRef.current) {
            onSave(canvasRef.current.toDataURL());
            onClose();
        }
    };

    const handleZoomIn = () => setScale(s => Math.min(5, s + 0.1));
    const handleZoomOut = () => setScale(s => Math.max(0.1, s - 0.1));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn("max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl")}>
                {/* Toolbar */}
                <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-muted/20">
                    <div className="flex items-center gap-2">
                        <DialogTitle className="me-4">Image Editor</DialogTitle>
                        
                        <div className="h-6 w-px bg-border mx-2" />
                        
                        <div className="flex gap-1 bg-muted p-1 rounded-md">
                            <Button 
                                variant={tool === 'brush' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setTool('brush')}
                            >
                                <Brush className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant={tool === 'eraser' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setTool('eraser')}
                            >
                                <Eraser className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="h-6 w-px bg-border mx-2" />

                        <div className="flex items-center gap-2 w-48">
                            <Label className="text-xs w-12">Size</Label>
                            <Slider 
                                value={[brushSize]} 
                                min={1} 
                                max={100} 
                                onValueChange={(val) => setBrushSize(val[0])}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 w-48">
                            <Label className="text-xs w-12">Opacity</Label>
                            <Slider 
                                value={[brushOpacity]} 
                                min={0.1} 
                                max={1.0} 
                                step={0.1}
                                onValueChange={(val) => setBrushOpacity(val[0])}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                            <ZoomIn className="w-4 h-4" />
                        </Button>

                        <div className="h-6 w-px bg-border mx-2" />

                        <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
                            <Undo className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
                            <Redo className="w-4 h-4" />
                        </Button>
                        
                        <div className="h-6 w-px bg-border mx-2" />
                        
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 me-2" />
                            Save Mask
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Canvas Container */}
                <div 
                    ref={containerRef}
                    className="flex-1 bg-neutral-900/50 relative overflow-hidden flex items-center justify-center p-8"
                >
                    <div style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease-out' }}>
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="shadow-2xl border border-white/10 bg-[url('/transparent-bg.png')] bg-repeat cursor-crosshair"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
