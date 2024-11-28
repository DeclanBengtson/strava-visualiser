import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoalService } from "./GoalService"
import { User, Award, Zap} from 'lucide-react'

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
    
    const ytdDistance = athleteStats.ytd_run_totals.distance  // Convert to km
    const allRunsTotal = athleteStats.all_run_totals.distance 
    const recentRunsTotal = athleteStats.recent_run_totals.distance 
    
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
                                    className="text-2xl font-bold">{formatDistance(allRunsTotal)}</span>
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
                                    className="text-2xl font-bold">{formatDistance(ytdDistance)}</span>
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
                                    className="text-2xl font-bold">{formatDistance(recentRunsTotal)}</span>
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
            <div className="w-full lg:w-2/3">
                <GoalService ytdDistance={ytdDistance} formatDistance={formatDistance}/>
            </div>
        </div>
    )
}