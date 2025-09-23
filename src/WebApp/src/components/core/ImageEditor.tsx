import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TODO: This component is using 'any' for the canvas object to bypass type errors.
// This is not ideal and should be fixed later by creating proper type definitions for Fabric.js.

export const ImageEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<any | null>(null);
    const [brushSize, setBrushSize] = useState(10);
    const [brushColor, setBrushColor] = useState('#000000');

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current) {
            const newCanvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#f0f0f0',
            });
            setCanvas(newCanvas);
            return () => {
                newCanvas.dispose();
            };
        }
    }, []);

    // Setup event listeners
    useEffect(() => {
        if (canvas) {
            const handleMouseWheel = (opt: any) => {
                const delta = opt.e.deltaY;
                let zoom = canvas.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            };

            const handleMouseDown = (opt: any) => {
                const evt = opt.e;
                if (evt.altKey === true) {
                    canvas.isDragging = true;
                    canvas.selection = false;
                    canvas.lastPosX = evt.clientX;
                    canvas.lastPosY = evt.clientY;
                }
            };

            const handleMouseMove = (opt: any) => {
                if (canvas.isDragging) {
                    const e = opt.e;
                    const vpt = canvas.viewportTransform;
                    vpt[4] += e.clientX - canvas.lastPosX;
                    vpt[5] += e.clientY - canvas.lastPosY;
                    canvas.requestRenderAll();
                    canvas.lastPosX = e.clientX;
                    canvas.lastPosY = e.clientY;
                }
            };

            const handleMouseUp = () => {
                canvas.isDragging = false;
                canvas.selection = true;
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
    }, [canvas]);

    const toggleDrawingMode = (isDrawing: boolean) => {
        if (canvas) {
            canvas.isDrawingMode = isDrawing;
        }
    };

    const setBrush = (color: string, width: number) => {
        if (canvas) {
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = width;
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && canvas) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgObj = new Image();
                imgObj.src = event.target?.result as string;
                imgObj.onload = () => {
                    fabric.Image.fromURL(imgObj.src, (image) => {
                        if (image) {
                            canvas.centerObject(image);
                            canvas.add(image);
                            canvas.renderAll();
                        }
                    });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <Input type="file" onChange={handleImageUpload} accept="image/*" />
                <Button onClick={() => { toggleDrawingMode(true); setBrush(brushColor, brushSize); }}>Paint</Button>
                <Button onClick={() => { toggleDrawingMode(true); setBrush('white', brushSize); }}>Eraser</Button>
                <Button onClick={() => toggleDrawingMode(false)}>Select</Button>
                <Input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} className="w-10 h-10" />
                <Input type="range" min="1" max="100" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
            </div>
            <div className="border border-border rounded-lg">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};