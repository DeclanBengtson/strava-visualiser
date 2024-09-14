"use client"

import * as React from "react"
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts"

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
import {Legend, Tooltip} from "chart.js";

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
        []
    )

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing last 100 recents activites
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="distance" stroke="#8884d8" activeDot={{ r: 8 }} name="Distance (km)" />
                        <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#82ca9d" name="Duration (hours)" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
