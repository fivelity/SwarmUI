import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Cpu, Database, HardDrive } from "lucide-react";
import { useServerStore } from "@/stores/useServerStore";
import type { ServerGpuInfo } from "@/types/server";

type GpuInfo = ServerGpuInfo;

export function BackendTelemetry() {
    const resources = useServerStore((s) => s.resources);
    const history = useServerStore((s) => s.telemetryHistory);
    const error = useServerStore((s) => s.telemetryError);

    const firstGpu: GpuInfo | undefined = useMemo(() => {
        const gpus = resources?.gpus;
        if (!gpus) return undefined;
        const vals = Object.values(gpus);
        return vals.length > 0 ? vals[0] : undefined;
    }, [resources]);

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

    const cpuUsage = resources.cpu?.usage ?? 0;
    const cpuCores = resources.cpu?.cores ?? 0;
    const ramUsed = resources.system_ram?.used ?? 0;
    const ramTotal = resources.system_ram?.total ?? 0;
    const ramPct = ramTotal > 0 ? (ramUsed / ramTotal) * 100 : 0;

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
                        <div className="text-2xl font-bold">{cpuUsage.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {cpuCores} Cores
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
                            {((ramUsed / 1024 / 1024 / 1024).toFixed(1))} GB
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Total: {(ramTotal / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                            <span>{ramPct.toFixed(1)}%</span>
                        </div>
                        {/* RAM Bar */}
                        <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-500" 
                                style={{ width: `${ramPct}%` }}
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
                                <div className="text-2xl font-bold">{firstGpu.utilization_gpu ?? 0}%</div>
                                <p className="text-xs text-muted-foreground truncate" title={firstGpu.name ?? "GPU"}>
                                    {firstGpu.name ?? "GPU"}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Temp: {firstGpu.temperature ?? 0}°C</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">VRAM Usage</CardTitle>
                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {(() => {
                                    const used = firstGpu.used_memory ?? 0;
                                    const total = firstGpu.total_memory ?? 0;
                                    const pct = total > 0 ? (used / total) * 100 : 0;
                                    return (
                                        <>
                                <div className="text-2xl font-bold">
                                    {((used / 1024 / 1024 / 1024).toFixed(1))} GB
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Total: {(total / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                                    <span>{pct.toFixed(1)}%</span>
                                </div>
                                {/* VRAM Bar */}
                                <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-purple-500 transition-all duration-500" 
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                        </>
                                    );
                                })()}
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
