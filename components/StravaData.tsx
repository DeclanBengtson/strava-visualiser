'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import ChartComponent from "@/components/StravaChart.tsx";
import RadarComponent from "@/components/StravaRadar.tsx";
import { RecentActivities } from "@/components/RecentActivities"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Stats} from "@/components/Stats.tsx";
import { AthleteAvatar } from "@/components/AthleteAvatar"

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

interface Athlete {
    id: number
    city: string
    firstname: string
    lastname: string
    profile: string
}

interface DashboardData {
    activities: StravaActivity[]
    athleteStats: AthleteStats
    athlete: Athlete
    page: number
    perPage: number
    limit: number
}

export default function StravaData() {
    const [data, setData] = useState<DashboardData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/strava/activities?page=1&per_page=30&limit=200')
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
        const km = (distance).toFixed(2)
        return `${km} km`
    }

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...')
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
        <div className="container mx-auto p-4 bg-black text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Strava Dashboard</h1>
                <AthleteAvatar athlete={data['athlete']} onLogout={handleLogout}/>
            </div>
            <Tabs defaultValue="stats" className="space-y-4">
                <TabsList className="bg-gray-100">
                    <TabsTrigger value="stats" className="flex items-center space-x-2 data-[state=active]:bg-gray-300">
                        <span>Stats</span>
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="flex items-center space-x-2 data-[state=active]:bg-gray-300">
                        <span>Activities</span>
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="flex items-center space-x-2 data-[state=active]:bg-gray-300">
                        <span>Chart</span>
                    </TabsTrigger>
                    <TabsTrigger value="radar" className="flex items-center space-x-2 data-[state=active]:bg-gray-300">
                        <span>Radar</span>
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
                        initialPage={data['page']}
                        initialPerPage={data['perPage']}
                    />
                </TabsContent>
                <TabsContent value="chart">
                    <div className="h-[calc(100vh-12rem)]">
                        <ChartComponent activities={data['activities']}/>
                    </div>
                </TabsContent>
                <TabsContent value="radar">
                    <div className="h-[calc(100vh-12rem)]">
                        <RadarComponent activities={data['activities']}/>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}