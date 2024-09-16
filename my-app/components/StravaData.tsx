'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Activity, Calendar, Clock, MapPin, TrendingUp, User, Award, Zap, Bike, BarChart2} from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area"
import ChartComponent from "@/components/StravaChart.tsx";
import { RecentActivities } from "@/components/RecentActivities"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Stats} from "@/components/Stats.tsx";
import {LineChart} from "recharts";

interface StravaActivity {
    id: number
    name: string
    type: string
    distance: number
    moving_time: number
    total_elevation_gain: number
    start_date_local: string
    start_latlng: [number, number] | null
}

interface AthleteStats {
    recent_run_totals: {
        count: number
        distance: number
        moving_time: number
        elevation_gain: number
    }
    ytd_run_totals: {
        count: number
        distance: number
        moving_time: number
        elevation_gain: number
    }
    all_run_totals: {
        count: number
        distance: number
        moving_time: number
        elevation_gain: number
    }
}

interface DashboardData {
    activities: StravaActivity[]
    athleteStats: AthleteStats
}

export default function StravaData() {
    const [data, setData] = useState<DashboardData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showChart, setShowChart] = useState(false)
    
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/strava/activities')
            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }
            const dashboardData = await response.json()
            
            setData(dashboardData)
            
            
        } catch (err) {
            setError('Failed to load data. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    
 console.log(data['athleteStats'])

    useEffect(() => {
        fetchData()
    }, [])

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${minutes}m`
    }
    
    const formatDistance = (distance: number) => {
        const km = (distance / 1000).toFixed(2)
        return `${km} km`
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchData}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Strava Dashboard</h1>

            <Tabs defaultValue="stats" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="stats" className="flex items-center space-x-2">
                        <LineChart className="h-4 w-4"/>
                        <span>Stats</span>
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="flex items-center space-x-2">
                        <Activity className="h-4 w-4"/>
                        <span>Activities</span>
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="flex items-center space-x-2">
                        <BarChart2 className="h-4 w-4"/>
                        <span>Chart</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="stats">
                    <Stats
                        athleteStats={data['athleteStats']}
                        formatDistance={formatDistance}
                        formatDuration={formatDuration}
                    />
                </TabsContent>
                <TabsContent value="activities">
                    <RecentActivities
                        activities={data['activities']}
                        formatDate={formatDate}
                        formatDuration={formatDuration}
                        formatDistance={formatDistance}
                    />
                </TabsContent>
                <TabsContent value="chart">
                    <div className="h-[calc(100vh-12rem)]">
                        <ChartComponent activities={data['activities']}/>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}