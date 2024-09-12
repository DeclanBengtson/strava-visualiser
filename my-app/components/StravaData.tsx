'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
    id: number
    name: string
    distance: number
    moving_time: number
    type: string
}

export default function StravaData() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    console.log("Hello I am data")
    const fetchActivities = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/strava/activities')
            if (!response.ok) {
                throw new Error('Failed to fetch activities')
            }
            const data = await response.json()
            setActivities(data)
        } catch (err) {
            setError('Failed to load activities. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities()
    }, [])

    if (loading) {
        return <div>Loading Strava data...</div>
    }

    if (error) {
        return (
            <div>
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchActivities}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Strava Activities</h2>
            {activities.map((activity) => (
                <Card key={activity.id}>
                    <CardHeader>
                        <CardTitle>{activity.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Type: {activity.type}</p>
                        <p>Distance: {(activity.distance / 1000).toFixed(2)} km</p>
                        <p>Duration: {Math.floor(activity.moving_time / 60)} minutes</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}