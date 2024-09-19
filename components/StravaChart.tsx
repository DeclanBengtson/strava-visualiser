"use client"

import * as React from "react"
import {CartesianGrid, BarChart, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, Bar, TooltipProps} from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface StravaActivity {
    id: number;
    name: string;
    distance: number;
    moving_time: number;
    start_date_local: string;
    // Add other relevant fields
}


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


export default function ChartComponent() {
    const [showDuration, setShowDuration] = React.useState(false);
    const [activities, setActivities] = React.useState<StravaActivity[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/strava/activities?limit=200');
                if (!response.ok) {
                    throw new Error('Failed to fetch activities');
                }
                const data = await response.json();
                setActivities(data.chartActivities);
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('Failed to load activities. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const chartData = React.useMemo(() => {
        return activities.map(activity => ({
            date: new Date(activity.start_date_local).toLocaleDateString(),
            distance: activity.distance / 1000, // Convert to kilometers
            duration: activity.moving_time / 3600 // Convert to hours
        }));
    }, [activities]);

    const total = React.useMemo(
        () => ({
            duration: chartData.reduce((acc, curr) => acc + curr.duration, 0),
            distance: chartData.reduce((acc, curr) => acc + curr.distance, 0),
        }),
        [chartData]
    )

    if (loading) {
        return (
            <Card className="bg-black text-gray-100">
                <CardHeader>
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription className="text-gray-400">
                        Loading activity data...
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-black text-gray-100">
                <CardHeader>
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription className="text-gray-400">
                        Error loading data
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }
    
    if (!activities || activities.length === 0) {
        return (
            <Card className="bg-black text-gray-100">
                <CardHeader>
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription className="text-gray-400">
                        No activity data available
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p>No activities to display</p>
                </CardContent>
            </Card>
        );
    }
    


    return (
        <Card className="bg-black text-gray-100">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-gray-800 p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription className="text-gray-400">
                        Showing last {activities.length} recent activities
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
