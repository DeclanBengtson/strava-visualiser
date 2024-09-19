import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress.tsx"
import { Input } from "@/components/ui/input.tsx"
import { User, Award, Zap, Target } from 'lucide-react'
import {useState, useEffect} from "react";

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

interface StatsProps {
    athleteStats: AthleteStats
    formatDistance: (distance: number) => string
    formatDuration: (seconds: number) => string
}

export function Stats({ athleteStats, formatDistance, formatDuration }: StatsProps) {
    const [goalDistance, setGoalDistance] = useState(1000)
    const ytdDistance = athleteStats.ytd_run_totals.distance / 1000 // Convert to km
    const percentageComplete = Math.min(100, (ytdDistance / goalDistance) * 100)

    const [daysIntoYear, setDaysIntoYear] = useState(0)
    const [expectedDistance, setExpectedDistance] = useState(0)

    useEffect(() => {
        const now = new Date()
        const start = new Date(now.getFullYear(), 0, 0)
        const diff = now.getTime() - start.getTime()
        const oneDay = 1000 * 60 * 60 * 24
        const day = Math.floor(diff / oneDay)
        setDaysIntoYear(day)

        const expected = (day / 365) * goalDistance
        setExpectedDistance(expected)
    }, [goalDistance])

    const distanceDifference = ytdDistance - expectedDistance
    const isAhead = distanceDifference > 0
    
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 space-y-4">
                <Card className="bg-black text-white border">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                            <User className="h-5 w-5"/>
                            <span>Athlete Overview</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-400">Total Runs</span>
                                <span className="text-2xl font-bold">{athleteStats.all_run_totals.count}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">Total Distance</span>
                                <span
                                    className="text-2xl font-bold">{formatDistance(athleteStats.all_run_totals.distance)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">Total Time</span>
                                <span
                                    className="text-2xl font-bold">{formatDuration(athleteStats.all_run_totals.moving_time)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">Total Elevation</span>
                                <span
                                    className="text-2xl font-bold">{athleteStats.all_run_totals.elevation_gain.toFixed(0)} m</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-black text-white border ">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                            <Award className="h-5 w-5"/>
                            <span>Year-to-Date Stats</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-400">YTD Runs</span>
                                <span className="text-2xl font-bold">{athleteStats.ytd_run_totals.count}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">YTD Distance</span>
                                <span
                                    className="text-2xl font-bold">{formatDistance(athleteStats.ytd_run_totals.distance)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">YTD Time</span>
                                <span
                                    className="text-2xl font-bold">{formatDuration(athleteStats.ytd_run_totals.moving_time)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">YTD Elevation</span>
                                <span
                                    className="text-2xl font-bold">{athleteStats.ytd_run_totals.elevation_gain.toFixed(0)} m</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-black text-white border ">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-lg">
                            <Zap className="h-5 w-5"/>
                            <span>Recent Runs</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-400">Recent Runs</span>
                                <span className="text-2xl font-bold">{athleteStats.recent_run_totals.count}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">Recent Distance</span>
                                <span
                                    className="text-2xl font-bold">{formatDistance(athleteStats.recent_run_totals.distance)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">Recent Time</span>
                                <span
                                    className="text-2xl font-bold">{formatDuration(athleteStats.recent_run_totals.moving_time)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400">Recent Elevation</span>
                                <span
                                    className="text-2xl font-bold">{athleteStats.recent_run_totals.elevation_gain.toFixed(0)} m</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="w-full lg:w-2/3 h-[50vh] bg-black text-white border ">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl">
                        <Target className="h-6 w-6"/>
                        <span>YTD Distance Goal</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className=" overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="goalDistance" className="text-lg">Annual Goal:</label>
                            <Input
                                id="goalDistance"
                                type="number"
                                value={goalDistance}
                                onChange={(e) => setGoalDistance(Number(e.target.value))}
                                className="bg-gray-800 text-white border-gray-700 w-32"
                                min="1"
                            />
                            <span className="text-lg">km</span>
                        </div>
                        <div className="space-y-2">
                            <Progress value={percentageComplete} className="w-full bg-white h-2"/>
                            <p className="text-center text-xl font-bold">
                                {ytdDistance.toFixed(2)} / {goalDistance} km
                            </p>
                            <p className="text-center text-lg">
                                {percentageComplete.toFixed(1)}% Complete
                            </p>
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg">
                                {isAhead ? "Ahead by " : "Behind by "}
                                <span className={`text-xl font-bold ${isAhead ? "text-green-500" : "text-red-500"}`}>
                                    {Math.abs(distanceDifference).toFixed(2)} km
                                </span>
                            </p>
                            <p className="text-gray-400">
                                Expected: {expectedDistance.toFixed(2)} km
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm">Days into year: {daysIntoYear}</p>
                            <p className="text-sm">Days remaining: {365 - daysIntoYear}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}