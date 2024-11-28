'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ChartComponent from "@/components/StravaChart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stats } from "@/components/Stats"
import { AthleteAvatar } from "@/components/AthleteAvatar"
import YearlyProgressChart from "@/components/YearlyProgressChart"

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
    biggest_ride_distance: number
    biggest_climb_elevation_gain: number
    recent_ride_totals: {
        count: number
        distance: number
        moving_time: number
        elevation_gain: number
    }
    all_ride_totals: {
        count: number
        distance: number
        moving_time: number
        elevation_gain: number
    }
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
    username: string
    resource_state: number
    firstname: string
    lastname: string
    city: string
    profile: string
}

interface DashboardData {
    athlete: Athlete
    athleteStats: AthleteStats
    chartActivities: StravaActivity[]
    limit: number
    oldestActivityTime: number
    perPage: number
}

export default function StravaData() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const fetchActivities = useCallback(async (before: number, perPage: number) => {
        const response = await fetch(`/api/strava/activities?before=${before}&per_page=${perPage}`)
        if (!response.ok) {
            throw new Error('Failed to fetch activities')
        }
        return await response.json()
    }, [])

    const fetchAllActivities = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            let allActivities: StravaActivity[] = []
            let athleteData: Athlete | null = null
            let athleteStats: AthleteStats | null = null
            const perPage = 200 // Strava API maximum per request
            const maxActivities = 1000
            let oldestActivityTime = Math.floor(Date.now() / 1000) // Start with current timestamp

            while (allActivities.length < maxActivities) {
                const fetchedData = await fetchActivities(oldestActivityTime, perPage)
                if (fetchedData.chartActivities.length === 0) break // No more activities to fetch

                // Capture athlete and athleteStats data from the first API call
                if (!athleteData) {
                    athleteData = fetchedData.athlete
                    athleteStats = fetchedData.athleteStats
                }

                allActivities = [...allActivities, ...fetchedData.chartActivities]
                oldestActivityTime = new Date(fetchedData.chartActivities[fetchedData.chartActivities.length - 1].start_date_local).getTime() / 1000 - 1

                if (fetchedData.chartActivities.length < perPage) break // Last page of activities
            }

            if (!athleteData || !athleteStats) {
                throw new Error('Failed to fetch athlete data')
            }

            setData({
                athlete: athleteData,
                athleteStats: athleteStats,
                chartActivities: allActivities.slice(0, maxActivities),
                limit: maxActivities,
                oldestActivityTime: oldestActivityTime,
                perPage: perPage
            })
            console.log("Fetched dashboard data:", {
                athlete: athleteData,
                athleteStats: athleteStats,
                chartActivities: `${allActivities.length} activities fetched`
            })
        } catch (err) {
            console.error('Error fetching data:', err)
            setError('Failed to load data. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [fetchActivities])

    useEffect(() => {
        fetchAllActivities()
    }, [fetchAllActivities])

    // const formatDate = (dateString: string) => {
    //     const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    //     return new Date(dateString).toLocaleDateString(undefined, options)
    // }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${minutes}m`
    }

    function formatDistance(distance: number): string {
        const km = distance / 1000
        return `${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(km)} km`
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/strava/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.ok) {
                setData(null)
                router.push('/')
            } else {
                throw new Error('Logout failed')
            }
        } catch (error) {
            console.error('Logout error:', error)
            setError('Logout failed. Please try again.')
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    }

    if (error || !data || !data.athlete) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error || 'No data available'}</div>
    }

    return (
        <div className="container mx-auto p-4 bg-black text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Strava Dashboard</h1>
                <AthleteAvatar athlete={data.athlete} onLogout={handleLogout}/>
            </div>
            <Tabs defaultValue="stats" className="space-y-4">
                <TabsList className="bg-gray-100">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly Progress</TabsTrigger>
                </TabsList>
                <TabsContent value="stats">
                    <Stats
                        athleteStats={data.athleteStats}
                        formatDistance={formatDistance}
                        formatDuration={formatDuration}
                    />
                </TabsContent>
                <TabsContent value="chart">
                    <div className="h-[calc(100vh-12rem)]">
                        <ChartComponent activities={data.chartActivities}/>
                    </div>
                </TabsContent>
                <TabsContent value="yearly">
                    <div className="h-[calc(100vh-12rem)]">
                        <YearlyProgressChart activities={data.chartActivities} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

