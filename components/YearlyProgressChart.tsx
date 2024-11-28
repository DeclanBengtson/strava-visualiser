'use client'

import { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StravaActivity } from '@/types/strava'

interface YearlyProgressChartProps {
    activities: StravaActivity[]
}

interface YearlyData {
    [year: number]: {
        [month: number]: number
    }
}

interface ChartData {
    date: string
    [year: string]: number | string
}

export default function YearlyProgressChart({ activities }: YearlyProgressChartProps) {
    const chartData = useMemo(() => {
        const yearlyData: YearlyData = {}

        activities.forEach((activity) => {
            const date = new Date(activity.start_date_local)
            const year = date.getFullYear()
            const month = date.getMonth()

            if (!yearlyData[year]) {
                yearlyData[year] = {}
            }

            if (!yearlyData[year][month]) {
                yearlyData[year][month] = 0
            }

            yearlyData[year][month] += activity.distance / 1000 // Convert to km
        })

        const chartData: ChartData[] = []

        for (let month = 0; month < 12; month++) {
            const dataPoint: ChartData = {
                date: new Date(2000, month, 1).toLocaleString('default', { month: 'short' })
            }

            Object.keys(yearlyData).forEach((year) => {
                let cumulativeDistance = 0
                for (let i = 0; i <= month; i++) {
                    cumulativeDistance += yearlyData[parseInt(year)][i] || 0
                }
                dataPoint[year] = parseFloat(cumulativeDistance.toFixed(2))
            })

            chartData.push(dataPoint)
        }

        return chartData
    }, [activities])

    const years = useMemo(() => {
        return Object.keys(chartData[0]).filter(key => key !== 'date')
    }, [chartData])

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c']

    return (
        <Card className="w-full h-full bg-black text-white">
            <CardHeader>
                <CardTitle>Yearly Progress</CardTitle>
                <CardDescription>Cumulative distance per year</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {years.map((year, index) => (
                            <Line
                                key={year}
                                type="monotone"
                                dataKey={year}
                                stroke={colors[index % colors.length]}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

