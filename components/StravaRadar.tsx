"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

interface Activity {
    start_date: string
}

interface RadarChartComponentProps {
    activities: Activity[] | undefined
}

export default function RadarChartComponent({ activities }: RadarChartComponentProps) {
    const [chartData, setChartData] = useState<{ name: string; activities: number }[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (activities) {
            try {
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                const today = new Date()
                const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)

                const monthlyActivityCounts = new Array(6).fill(0).map((_, index) => {
                    const month = new Date(today.getFullYear(), today.getMonth() - index, 1)
                    return {
                        name: monthNames[month.getMonth()],
                        activities: 0
                    }
                })

                activities.forEach(activity => {
                    const activityDate = new Date(activity.start_date)
                    if (activityDate >= sixMonthsAgo) {
                        const monthIndex = monthlyActivityCounts.findIndex(m => m.name === monthNames[activityDate.getMonth()])
                        if (monthIndex !== -1) {
                            monthlyActivityCounts[monthIndex].activities++
                        }
                    }
                })
                
                setChartData(monthlyActivityCounts.reverse())
                setLoading(false)
                
            } catch (err) {
                console.error('Error processing activity data:', err)
                setError('Failed to process activity data. Please try again.')
                setLoading(false)
            }
        }
    }, [activities])

    if (loading) {
        return (
            <Card className="w-full h-full bg-black text-white">
                <CardHeader>
                    <CardTitle>Monthly Activity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full h-full bg-black text-white">
                <CardHeader>
                    <CardTitle>Monthly Activity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full h-full bg-black text-white">
            <CardHeader>
                <CardTitle>Monthly Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="name" stroke="#888" />
                        <PolarRadiusAxis stroke="#888" />
                        <Radar name="Activities" dataKey="activities" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}