import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
    Eraser, 
    Brush, 
    ZoomIn, 
    ZoomOut, 
    Undo, 
    Redo, 
    Save, 
    X,
    Hand,
    Move
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useParameterStore } from "@/stores/parameterStore";

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
    const [isPanning, setIsPanning] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [brushOpacity, setBrushOpacity] = useState(1.0);
    const [tool, setTool] = useState<'brush' | 'eraser' | 'pan'>('brush');
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Global Params
    const maskBlur = useParameterStore(state => state.maskBlur);
    const setMaskBlur = useParameterStore(state => state.setMaskBlur);
    const maskGrow = useParameterStore(state => state.maskGrow);
    const setMaskGrow = useParameterStore(state => state.setMaskGrow);

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

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                const prevState = history[historyIndex - 1];
                ctx.putImageData(prevState, 0, 0);
                setHistoryIndex(historyIndex - 1);
            }
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                const nextState = history[historyIndex + 1];
                ctx.putImageData(nextState, 0, 0);
                setHistoryIndex(historyIndex + 1);
            }
        }
    }, [history, historyIndex]);

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
            setPan({ x: 0, y: 0 });
            setScale(1);
            // Save initial state
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([imageData]);
            setHistoryIndex(0);
        };
    }, [isOpen, imageUrl]);

    // Keyboard Shortcuts
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                // Temporary pan logic could go here
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, redo, undo]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const isMiddleClick = e.button === 1;
        const isShift = e.shiftKey;
        
        if (tool === 'pan' || isMiddleClick || isShift) {
            setIsPanning(true);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            return;
        }

        startDrawing(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            return;
        }

        draw(e);
    };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
            return;
        }
        stopDrawing();
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
        if (ctx) ctx.beginPath(); 
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

        ctx.lineWidth = brushSize; 
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

    const handleZoomIn = () => setScale(s => Math.min(5, s + 0.5));
    const handleZoomOut = () => setScale(s => Math.max(0.1, s - 0.5));
    const handleResetView = () => {
        setScale(1);
        setPan({ x: 0, y: 0 });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn("max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl")}>
                {/* Toolbar */}
                <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-muted/20">
                    <div className="flex items-center gap-4">
                        <DialogTitle className="me-2">Editor</DialogTitle>
                        
                        <div className="h-8 w-px bg-border" />
                        
                        {/* Tools */}
                        <div className="flex gap-1 bg-muted p-1 rounded-md">
                            <Button 
                                variant={tool === 'brush' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setTool('brush')}
                                title="Brush (B)"
                            >
                                <Brush className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant={tool === 'eraser' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setTool('eraser')}
                                title="Eraser (E)"
                            >
                                <Eraser className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant={tool === 'pan' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setTool('pan')}
                                title="Pan (Space/Middle Click)"
                            >
                                <Hand className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="h-8 w-px bg-border" />

                        {/* Brush Settings */}
                        <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Size</span>
                                <span>{brushSize}px</span>
                            </div>
                            <Slider 
                                value={[brushSize]} 
                                min={1} 
                                max={100} 
                                onValueChange={(val) => setBrushSize(val[0])}
                                className="h-4"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Opacity</span>
                                <span>{Math.round(brushOpacity * 100)}%</span>
                            </div>
                            <Slider 
                                value={[brushOpacity]} 
                                min={0.1} 
                                max={1.0} 
                                step={0.1}
                                onValueChange={(val) => setBrushOpacity(val[0])}
                                className="h-4"
                            />
                        </div>

                        <div className="h-8 w-px bg-border" />

                        {/* Mask Parameters */}
                        <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Blur</span>
                                <span>{maskBlur}px</span>
                            </div>
                            <Slider 
                                value={[maskBlur]} 
                                min={0} 
                                max={64} 
                                onValueChange={(val) => setMaskBlur(val[0])}
                                className="h-4"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Grow/Shrink</span>
                                <span>{maskGrow}px</span>
                            </div>
                            <Slider 
                                value={[maskGrow]} 
                                min={-64} 
                                max={64} 
                                step={1}
                                onValueChange={(val) => setMaskGrow(val[0])}
                                className="h-4"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleResetView} title="Reset View">
                            <Move className="w-4 h-4" />
                        </Button>
                        <div className="h-6 w-px bg-border mx-2" />
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
                            Save
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
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div 
                        style={{ 
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, 
                            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                            cursor: tool === 'pan' || isPanning ? 'grab' : 'crosshair'
                        }}
                    >
                        <canvas 
                            ref={canvasRef}
                            className="shadow-2xl border border-white/10 bg-[url('/transparent-bg.png')] bg-repeat"
                            style={{
                                maxWidth: 'none', // Remove maxWidth constraints to allow zoom
                                maxHeight: 'none',
                                display: 'block',
                                touchAction: 'none'
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
