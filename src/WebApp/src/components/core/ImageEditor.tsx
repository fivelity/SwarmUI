import React, { useEffect, useRef, useState } from 'react';
import { Canvas, FabricImage, TEvent, Point, TPointerEvent } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Upload, Pencil, Eraser, MousePointer, ZoomIn, ZoomOut } from 'lucide-react';

export const ImageEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [brushSize, setBrushSize] = useState(10);
    const [brushColor, setBrushColor] = useState('#000000');
    const [isDrawingMode, setIsDrawingMode] = useState(false);

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current) {
            const newCanvas = new Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#f0f0f0',
                isDrawingMode: isDrawingMode,
            });
            setCanvas(newCanvas);
            return () => {
                newCanvas.dispose();
            };
        }
    }, []);

    // Setup event listeners and brush
    useEffect(() => {
        if (canvas) {
            canvas.isDrawingMode = isDrawingMode;
            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = brushColor;
                canvas.freeDrawingBrush.width = brushSize;
            }

            const handleMouseWheel = (opt: TEvent<WheelEvent>) => {
                if (!opt.e) return;
                const delta = opt.e.deltaY;
                let zoom = canvas.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            };

            const handleMouseDown = (opt: TEvent<TPointerEvent>) => {
                if (!opt.e) return;
                const evt = opt.e;
                if (evt.altKey === true) {
                    canvas.isDragging = true;
                    canvas.selection = false;
                    if (evt instanceof TouchEvent) {
                        canvas.lastPosX = evt.touches[0].clientX;
                        canvas.lastPosY = evt.touches[0].clientY;
                    } else {
                        canvas.lastPosX = evt.clientX;
                        canvas.lastPosY = evt.clientY;
                    }
                }
            };

            const handleMouseMove = (opt: TEvent<TPointerEvent>) => {
                if (canvas.isDragging) {
                    if (!opt.e) return;
                    const e = opt.e;
                    const vpt = canvas.viewportTransform;
                    if (vpt && canvas.lastPosX && canvas.lastPosY) {
                        let clientX, clientY;
                        if (e instanceof TouchEvent) {
                            clientX = e.touches[0].clientX;
                            clientY = e.touches[0].clientY;
                        } else {
                            clientX = e.clientX;
                            clientY = e.clientY;
                        }
                        vpt[4] += clientX - canvas.lastPosX;
                        vpt[5] += clientY - canvas.lastPosY;
                        canvas.requestRenderAll();
                        canvas.lastPosX = clientX;
                        canvas.lastPosY = clientY;
                    }
                }
            };

            const handleMouseUp = () => {
                if (canvas.isDragging) {
                    canvas.isDragging = false;
                    canvas.selection = true;
                }
            };

            canvas.on('mouse:wheel', handleMouseWheel);
            canvas.on('mouse:down', handleMouseDown);
            canvas.on('mouse:move', handleMouseMove);
            canvas.on('mouse:up', handleMouseUp);

            return () => {
                canvas.off('mouse:wheel');
                canvas.off('mouse:down');
                canvas.off('mouse:move');
                canvas.off('mouse:up');
            };
        }
    }, [canvas, isDrawingMode, brushColor, brushSize]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && canvas) {
            const url = URL.createObjectURL(file);
            try {
                const image = await FabricImage.fromURL(url);
                canvas.centerObject(image);
                canvas.add(image);
                canvas.renderAll();
            } finally {
                URL.revokeObjectURL(url);
            }
        }
    };

    const setMode = (drawing: boolean, color?: string) => {
        setIsDrawingMode(drawing);
        if (color) {
            setBrushColor(color);
        }
    };
    
    const handleZoom = (factor: number) => {
        if (canvas) {
            const currentZoom = canvas.getZoom();
            canvas.setZoom(currentZoom * factor);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 bg-background rounded-lg">
            <div className="flex flex-wrap gap-2 items-center p-2 rounded-md bg-card border">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Upload Image</p></TooltipContent>
                    </Tooltip>
                    <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={isDrawingMode && brushColor !== 'white' ? 'secondary' : 'ghost'} size="icon" onClick={() => setMode(true, '#000000')}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Paint</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={isDrawingMode && brushColor === 'white' ? 'secondary' : 'ghost'} size="icon" onClick={() => setMode(true, 'white')}>
                                <Eraser className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Eraser</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={!isDrawingMode ? 'secondary' : 'ghost'} size="icon" onClick={() => setMode(false)}>
                                <MousePointer className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Select / Pan (Alt+Drag)</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleZoom(1.1)}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Zoom In</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleZoom(0.9)}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Zoom Out</p></TooltipContent>
                    </Tooltip>

                    <Input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} className="w-10 h-10 p-1 bg-card border-input" />
                    
                    <div className="flex items-center gap-2 w-32">
                        <Slider value={[brushSize]} onValueChange={(value) => setBrushSize(value[0])} min={1} max={100} step={1} />
                        <span className="text-sm">{brushSize}</span>
                    </div>
                </TooltipProvider>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};