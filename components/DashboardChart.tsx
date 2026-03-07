"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ChartProps {
    data: any[];
}

export default function DashboardChart({ data }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#66fcf1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#1f2833"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#45a29e' }}
                />
                <YAxis
                    stroke="#1f2833"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tick={{ fill: '#45a29e' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2833',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '10px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#66fcf1', strokeWidth: 1 }}
                />
                <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.3} label={{ position: 'right', value: 'CRITIQUE', fill: '#ef4444', fontSize: 8, fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="score" stroke="#66fcf1" strokeWidth={1} fillOpacity={1} fill="url(#colorScore)" animationDuration={2000} />
            </AreaChart>
        </ResponsiveContainer>
    );
}
