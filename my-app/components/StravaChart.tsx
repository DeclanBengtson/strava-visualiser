"use client"

import * as React from "react"
import {CartesianGrid, Line, LineChart, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar} from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {Legend} from "chart.js";

interface StravaActivity {
    id: number;
    name: string;
    distance: number;
    moving_time: number;
    start_date_local: string;
    // Add other relevant fields
}

interface StravaChartProps {
    activities: StravaActivity[];
}



const chartConfig = {
    views: {
        label: "Page Views",
    },
    duration: {
        label: "duration",
        color: "hsl(var(--chart-1))",
    },
    distance: {
        label: "distance",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 p-4 border border-gray-700 rounded shadow-lg">
                <p className="font-bold text-gray-200">{label}</p>
                <p className="text-[#8884d8]">Distance: {payload[0].value?.toFixed(2)} km</p>
                {payload[1] && <p className="text-[#82ca9d]">Duration: {payload[1].value?.toFixed(2)} hours</p>}
            </div>
        );
    }
    return null;
};



export default function ChartComponent({activities}: StravaChartProps) {
    const [showDuration, setShowDuration] = React.useState(false);

    const chartData = activities.map(activity => ({
        date: new Date(activity.start_date_local).toLocaleDateString(),
        distance: activity.distance / 1000, // Convert to kilometers
        duration: activity.moving_time / 3600 // Convert to hours
    }));
    
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("duration")

    const total = React.useMemo(
        () => ({
            duration: chartData.reduce((acc, curr) => acc + curr.duration, 0),
            distance: chartData.reduce((acc, curr) => acc + curr.distance, 0),
        }),
        [chartData]
    )

    return (
        <Card className="bg-black text-gray-100">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-gray-800 p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription className="text-gray-400">
                        Showing last 150 recent activities
                    </CardDescription>
                </div>
                <div className="flex items-center px-6 py-5 sm:py-6">
                    <Switch
                        id="show-duration"
                        checked={showDuration}
                        onCheckedChange={setShowDuration}
                        className="data-[state=checked]:bg-blue-500"
                    />
                    <Label htmlFor="show-duration" className="ml-2 text-gray-300">
                        Show Duration
                    </Label>
                </div>

            </CardHeader>
            <CardContent className="px-2 sm:p-6 bg-black text-white border border-gray-800">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                        />
                        {showDuration && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                        )}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend/>
                        <Bar
                            yAxisId="left"
                            dataKey="distance"
                            fill="#8884d8"
                            name="Distance (km)"
                        />
                        {showDuration && (
                            <Bar
                                yAxisId="right"
                                dataKey="duration"
                                fill="#82ca9d"
                                name="Duration (hours)"
                            />
                        )}
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex space-x-8 ">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#8884d8] mr-2"></div>
                        <span className="text-gray-300">Distance (km)</span>
                    </div>
                    {showDuration && (
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#82ca9d] mr-2"></div>
                            <span className="text-gray-300">Duration (hours)</span>
                        </div>
                    )}
                </div>
                <div className="flex space-x-8 ">
                    <div>
                        <h3 className="text-sm font-medium text-gray-400">Total Distance</h3>
                        <p className="text-2xl font-semibold text-gray-100">{total.distance.toFixed(2)} km</p>
                    </div>
                    {showDuration && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-400">Total Duration</h3>
                        <p className="text-2xl font-semibold text-gray-100">{total.duration.toFixed(2)} hours</p>
                    </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
