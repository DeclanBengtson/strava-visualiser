'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stats } from "@/components/Stats"
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
            const perPage = 200
            const maxActivities = 1000
            let oldestActivityTime = Math.floor(Date.now() / 1000)

            while (allActivities.length < maxActivities) {
                const fetchedData = await fetchActivities(oldestActivityTime, perPage)
                if (fetchedData.chartActivities.length === 0) break

                if (!athleteData) {
                    athleteData = fetchedData.athlete
                    athleteStats = fetchedData.athleteStats
                }

                allActivities = [...allActivities, ...fetchedData.chartActivities]
                oldestActivityTime = new Date(fetchedData.chartActivities[fetchedData.chartActivities.length - 1].start_date_local).getTime() / 1000 - 1

                if (fetchedData.chartActivities.length < perPage) break
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
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error || !data || !data.athlete) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500">
                Error: {error || 'No data available'}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Strava Dashboard
                            </h1>
                        </div>
                        <AthleteAvatar athlete={data.athlete} onLogout={handleLogout} />
                    </div>
                    
                    <Tabs defaultValue="stats" className="space-y-6">
                        <TabsContent value="stats" className="mt-6">
                            <Stats
                                athleteStats={data.athleteStats}
                                formatDistance={formatDistance}
                                formatDuration={formatDuration}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}