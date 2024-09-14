"use client"

import * as React from "react"
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

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

export const description = "An interactive line chart"

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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
                <p className="font-bold">{label}</p>
                <p className="text-[#8884d8]">Distance: {payload[0].value.toFixed(2)} km</p>
                <p className="text-[#82ca9d]">Duration: {payload[1].value.toFixed(2)} hours</p>
            </div>
        );
    }
    return null;
};

export default function ChartComponent({ activities }: StravaChartProps) {

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
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing last 150 recent activities
                    </CardDescription>
                </div>
                
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date"/>
                        <YAxis yAxisId="left"/>
                        <YAxis yAxisId="right" orientation="right"/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend/>
                        <Line yAxisId="left" type="monotone" dataKey="distance" stroke="#8884d8" activeDot={{r: 8}}
                              name="Distance (km)"/>
                        <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#82ca9d"
                              name="Duration (hours)"/>
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#8884d8] mr-2"></div>
                        <span>Distance (km)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#82ca9d] mr-2"></div>
                        <span>Duration (hours)</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Distance</h3>
                        <p className="text-2xl font-semibold text-gray-900">{total.distance.toFixed(2)} km</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Duration</h3>
                        <p className="text-2xl font-semibold text-gray-900">{total.duration.toFixed(2)} hours</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
