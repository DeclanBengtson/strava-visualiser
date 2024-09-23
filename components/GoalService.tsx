import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Target } from 'lucide-react'

interface GoalServiceProps {
    ytdDistance: number
    formatDistance: (distance: number) => string
}

export function GoalService({ ytdDistance, formatDistance }: GoalServiceProps) {
    const [goalDistance, setGoalDistance] = useState(3000)
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
    
    const percentageComplete = Math.min(100, (ytdDistance / goalDistance) * 100)
    const distanceDifference = ytdDistance - expectedDistance
    const isAhead = distanceDifference > 0

    return (
        <Card className="w-full h-[50vh] bg-black text-white border">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                    <Target className="h-6 w-6"/>
                    <span>YTD Distance Goal</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="goalDistance" className="text-lg">Annual Goal:</label>
                        <Input
                            id="goalDistance"
                            type="number"
                            value={goalDistance}
                            onChange={(e) => setGoalDistance(Number(e.target.value))}
                            className="bg-gray-800 text-white border-gray-700 w-32"
                        />
                        <span className="text-lg">km</span>
                    </div>
                    <div className="space-y-2">
                        <Progress
                            value={percentageComplete}
                            className="w-full h-3 bg-gray-700"
                            indicatorClassName="bg-gradient-to-r from-blue-500 to-green-500"
                        />
                        <p className="text-center text-xl font-bold">
                            {formatDistance(ytdDistance)} / {goalDistance} km
                        </p>
                        <p className="text-center text-lg">
                            {percentageComplete.toFixed(1)}% Complete
                        </p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-lg">
                            {isAhead ? "Ahead by " : "Behind by "}
                            <span className={`text-xl font-bold ${isAhead ? "text-green-500" : "text-red-500"}`}>
                                {formatDistance(Math.abs(distanceDifference))}
                            </span>
                        </p>
                        <p className="text-gray-400">
                            Expected: {formatDistance(expectedDistance)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm">Days into year: {daysIntoYear}</p>
                        <p className="text-sm">Days remaining: {365 - daysIntoYear}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}