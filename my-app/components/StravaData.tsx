'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Activity, Calendar, Clock, MapPin, TrendingUp, User, Award, Zap, Bike} from 'lucide-react'

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
            <h1 className="text-3xl font-bold text-center mb-8">Strava Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-6 w-6" />
                                <span>Athlete Overview</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>Total Rides: {data['athleteStats'].all_run_totals.count}</p>
                                <p>Total Distance: {(data['athleteStats'].all_run_totals.distance / 1000).toFixed(2)} km</p>
                                <p>Total Time: {formatDuration(data['athleteStats'].all_run_totals.moving_time || 0)}</p>
                                <p>Total Elevation: {data['athleteStats'].all_run_totals.elevation_gain.toFixed(0)} m</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Award className="h-6 w-6" />
                                <span>Year-to-Date Stats</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>YTD Runs: {data['athleteStats'].ytd_run_totals.count}</p>
                                <p>YTD Distance: {(data['athleteStats'].ytd_run_totals.distance / 1000).toFixed(2)} km</p>
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
                                <Zap className="h-6 w-6" />
                                <span>Recent Stats</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                                <p>Recent Rides: {data['athleteStats'].recent_run_totals.count}</p>
                                <p>Recent Distance: {(data['athleteStats'].recent_run_totals.distance / 1000).toFixed(2)} km</p>
                                <p>Recent Time: {formatDuration(data['athleteStats'].recent_run_totals.moving_time || 0)}</p>
                                <p>Recent Elevation: {data['athleteStats'].recent_run_totals.elevation_gain.toFixed(0)} m</p>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Add more cards here for additional data */}
                </div>

                {/* Right Column - Scrollable Activities */}
                <div className="lg:col-span-1 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
                    <Card> 
                    
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-6 w-6" />
                                <span>Recent Activities</span>
                            </CardTitle>
                        </CardHeader>
                        {data['activities'].map((activity) => (
                        <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-6 w-6" />
                                    <span>{activity.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Bike className="h-5 w-5 text-gray-500" />
                                        <span>{activity.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-gray-500" />
                                        <span>{formatDistance(activity.distance.toFixed(2))}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-5 w-5 text-gray-500" />
                                        <span>{formatDuration(activity.moving_time)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-gray-500" />
                                        <span>{activity.total_elevation_gain.toFixed(0)} m</span>
                                    </div>
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <span>{formatDate(activity.start_date_local)}</span>
                                    </div>
                                    {activity.start_latlng && (
                                        <div className="flex items-center space-x-2 col-span-2">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <span>
                        {activity.start_latlng[0].toFixed(2)}, {activity.start_latlng[1].toFixed(2)}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </Card>
                </div>
            </div>
        </div>
    )
}