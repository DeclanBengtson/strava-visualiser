import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Award, Zap } from 'lucide-react'

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
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="h-6 w-6"/>
                        <span>Athlete Overview</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p>Total Runs: {athleteStats.all_run_totals.count}</p>
                        <p>Total Distance: {formatDistance(athleteStats.all_run_totals.distance)}</p>
                        <p>Total Time: {formatDuration(athleteStats.all_run_totals.moving_time)}</p>
                        <p>Total Elevation: {athleteStats.all_run_totals.elevation_gain.toFixed(0)} m</p>
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
                        <p>YTD Runs: {athleteStats.ytd_run_totals.count}</p>
                        <p>YTD Distance: {formatDistance(athleteStats.ytd_run_totals.distance)}</p>
                        <p>YTD Time: {formatDuration(athleteStats.ytd_run_totals.moving_time)}</p>
                        <p>YTD Elevation: {athleteStats.ytd_run_totals.elevation_gain.toFixed(0)} m</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-6 w-6"/>
                        <span>Recent Runs</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p>Recent Runs: {athleteStats.recent_run_totals.count}</p>
                        <p>Recent Distance: {formatDistance(athleteStats.recent_run_totals.distance)}</p>
                        <p>Recent Time: {formatDuration(athleteStats.recent_run_totals.moving_time)}</p>
                        <p>Recent Elevation: {athleteStats.recent_run_totals.elevation_gain.toFixed(0)} m</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}