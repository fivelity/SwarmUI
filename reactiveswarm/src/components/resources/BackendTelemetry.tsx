import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { swarmApi } from "@/services/apiClient";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Cpu, Database, HardDrive } from "lucide-react";

interface ResourceInfo {
    cpu: {
        usage: number;
        cores: number;
    };
    system_ram: {
        total: number;
        used: number;
        free: number;
    };
    gpus: Record<string, {
        id: number;
        name: string;
        temperature: number;
        utilization_gpu: number;
        utilization_memory: number;
        total_memory: number;
        free_memory: number;
        used_memory: number;
    }>;
}

interface TelemetryPoint {
    time: string;
    cpu: number;
    ram: number;
    gpu: number;
    vram: number;
}

export function BackendTelemetry() {
    const [resources, setResources] = useState<ResourceInfo | null>(null);
    const [history, setHistory] = useState<TelemetryPoint[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await swarmApi.get<ResourceInfo>("/GetServerResourceInfo");
                setResources(data);

                setHistory(prev => {
                    const now = new Date();
                    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                                  now.getMinutes().toString().padStart(2, '0') + ':' + 
                                  now.getSeconds().toString().padStart(2, '0');
                    
                    // Aggregate GPU usage if multiple? Just take first for now.
                    const firstGpu = data.gpus ? Object.values(data.gpus)[0] : null;
                    const gpuUsage = firstGpu ? firstGpu.utilization_gpu : 0;
                    const vramUsage = firstGpu && firstGpu.total_memory > 0 
                        ? (firstGpu.used_memory / firstGpu.total_memory) * 100 
                        : 0;
                    
                    const ramUsage = data.system_ram.total > 0 
                        ? (data.system_ram.used / data.system_ram.total) * 100 
                        : 0;

                    const newPoint: TelemetryPoint = {
                        time: timeStr,
                        cpu: data.cpu.usage,
                        ram: ramUsage,
                        gpu: gpuUsage,
                        vram: vramUsage
                    };

                    const newHistory = [...prev, newPoint];
                    if (newHistory.length > 60) newHistory.shift(); // Keep last 60 seconds
                    return newHistory;
                });
                setError(null);
            } catch (err) {
                console.error("Failed to fetch telemetry:", err);
                setError("Failed to fetch telemetry. Ensure you have admin permissions.");
            }
        };

        // Fetch immediately
        fetchData();

        // Poll every 1s
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    if (error && !resources) {
        return (
            <div className="p-8 text-center text-destructive border border-destructive/50 rounded-lg bg-destructive/10">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <p>{error}</p>
            </div>
        );
    }

    if (!resources) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse">
                Loading telemetry...
            </div>
        );
    }

    const firstGpu = resources.gpus ? Object.values(resources.gpus)[0] : null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CPU Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{resources.cpu.usage.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {resources.cpu.cores} Cores
                        </p>
                    </CardContent>
                </Card>

                {/* RAM Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System RAM</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {((resources.system_ram.used / 1024 / 1024 / 1024).toFixed(1))} GB
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Total: {(resources.system_ram.total / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                            <span>{((resources.system_ram.used / resources.system_ram.total) * 100).toFixed(1)}%</span>
                        </div>
                        {/* RAM Bar */}
                        <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-500" 
                                style={{ width: `${(resources.system_ram.used / resources.system_ram.total) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* GPU Card */}
                {firstGpu && (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">GPU Usage</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{firstGpu.utilization_gpu}%</div>
                                <p className="text-xs text-muted-foreground truncate" title={firstGpu.name}>
                                    {firstGpu.name}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Temp: {firstGpu.temperature}°C</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">VRAM Usage</CardTitle>
                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {((firstGpu.used_memory / 1024 / 1024 / 1024).toFixed(1))} GB
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Total: {(firstGpu.total_memory / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                                    <span>{((firstGpu.used_memory / firstGpu.total_memory) * 100).toFixed(1)}%</span>
                                </div>
                                {/* VRAM Bar */}
                                <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-purple-500 transition-all duration-500" 
                                        style={{ width: `${(firstGpu.used_memory / firstGpu.total_memory) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Live Chart */}
            <Card className="h-[400px] flex flex-col">
                <CardHeader>
                    <CardTitle>Live Performance History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <XAxis 
                                dataKey="time" 
                                className="text-xs text-muted-foreground" 
                                tick={{ fill: 'currentColor', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                className="text-xs text-muted-foreground" 
                                tick={{ fill: 'currentColor', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                                itemStyle={{ color: 'var(--popover-foreground)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="cpu" 
                                stroke="#ef4444" 
                                fillOpacity={1} 
                                fill="url(#colorCpu)" 
                                name="CPU %"
                                isAnimationActive={false}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="gpu" 
                                stroke="#8b5cf6" 
                                fillOpacity={1} 
                                fill="url(#colorGpu)" 
                                name="GPU %"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
