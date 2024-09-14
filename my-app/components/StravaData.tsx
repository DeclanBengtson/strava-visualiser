'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Activity, Calendar, Clock, MapPin, TrendingUp, User, Award, Zap, Bike, BarChart2} from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area"
import ChartComponent from "@/components/StravaChart.tsx";

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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Strava Dashboard</h1>
                <Button onClick={() => setShowChart(!showChart)}>
                    {showChart ? 'Show Stats' : 'Show Chart'}
                    <BarChart2 className="ml-2 h-4 w-4"/>
                </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-center mb-8">Strava Dashboard</h1>
            {showChart ? (
                <div className="h-[calc(100vh-8rem)]">
                    <ChartComponent activities={data['activities']} />
                </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-6 w-6"/>
                                <span>Athlete Overview</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>Total Runs: {data['athleteStats'].all_run_totals.count}</p>
                                <p>Total
                                    Distance: {(data['athleteStats'].all_run_totals.distance / 1000).toFixed(2)} km</p>
                                <p>Total
                                    Time: {formatDuration(data['athleteStats'].all_run_totals.moving_time || 0)}</p>
                                <p>Total
                                    Elevation: {data['athleteStats'].all_run_totals.elevation_gain.toFixed(0)} m</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Award className="h-6 w-6"/>
                                <span>Year-to-Date Stats</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>YTD Runs: {data['athleteStats'].ytd_run_totals.count}</p>
                                <p>YTD
                                    Distance: {(data['athleteStats'].ytd_run_totals.distance / 1000).toFixed(2)} km</p>
                                <p>YTD Time: {formatDuration(data['athleteStats'].ytd_run_totals.moving_time || 0)}</p>
                                <p>YTD Elevation: {data['athleteStats'].ytd_run_totals.elevation_gain.toFixed(0)} m</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Column */}

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Zap className="h-6 w-6"/>
                                <span>Recent Runs</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>Recent Runs: {data['athleteStats'].recent_run_totals.count}</p>
                                <p>Recent
                                    Distance: {(data['athleteStats'].recent_run_totals.distance / 1000).toFixed(2)} km</p>
                                <p>Recent
                                    Time: {formatDuration(data['athleteStats'].recent_run_totals.moving_time || 0)}</p>
                                <p>Recent
                                    Elevation: {data['athleteStats'].recent_run_totals.elevation_gain.toFixed(0)} m</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Add more cards here for additional data */}
                </div>

                {/* Right Column - Scrollable Activities */}
                <Card className="h-[calc(100vh-2rem)] flex flex-col">
                    <CardHeader className="sticky top-0 z-10 bg-white border-b">
                        <CardTitle className="flex items-center space-x-2">
                            <Activity className="h-6 w-6"/>
                            <span>Recent Activities</span>
                        </CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-grow">
                        <div className="space-y-4 p-4">
                            {data['activities'].map((activity) => (
                                <Card key={activity.id} className="hover:shadow-md transition-shadow duration-300">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-semibold">{activity.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Bike className="h-4 w-4 text-gray-500"/>
                                                <span>{activity.type}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="h-4 w-4 text-gray-500"/>
                                                <span>{formatDistance(activity.distance)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-500"/>
                                                <span>{formatDuration(activity.moving_time)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="h-4 w-4 text-gray-500"/>
                                                <span>{activity.total_elevation_gain.toFixed(0)} m</span>
                                            </div>
                                            <div className="flex items-center space-x-2 col-span-2">
                                                <Calendar className="h-4 w-4 text-gray-500"/>
                                                <span>{formatDate(activity.start_date_local)}</span>
                                            </div>
                                            {activity.start_latlng && (
                                                <div className="flex items-center space-x-2 col-span-2">
                                                    <MapPin className="h-4 w-4 text-gray-500"/>
                                                    <span>
                        {activity.start_latlng[0].toFixed(2)}, {activity.start_latlng[1].toFixed(2)}
                      </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
                )}
        </div>
    )
}