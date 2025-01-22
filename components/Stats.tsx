import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Award, Zap } from 'lucide-react'
import WeeklyDistanceChart from './WeeklyChart' 

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
    const ytdDistance = athleteStats.ytd_run_totals.distance
    const allRunsTotal = athleteStats.all_run_totals.distance
    const recentRunsTotal = athleteStats.recent_run_totals.distance

    const StatCard = ({ title, icon: Icon, stats }) => (
        <Card className="bg-gray-900 text-white border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-lg font-medium">
                    <Icon className="h-5 w-5 text-orange-500"/>
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col space-y-1">
                            <span className="text-gray-400 text-xs font-medium">{stat.label}</span>
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row justify-center gap-6">
                <StatCard 
                    title="Athlete Overview"
                    icon={User}
                    stats={[
                        { label: "Total Runs", value: athleteStats.all_run_totals.count },
                        { label: "Total Distance", value: formatDistance(allRunsTotal) },
                        { label: "Total Time", value: formatDuration(athleteStats.all_run_totals.moving_time) },
                        { label: "Total Elevation", value: `${athleteStats.all_run_totals.elevation_gain.toFixed(0)} m` }
                    ]}
                />

                <StatCard 
                    title="Year-to-Date Stats"
                    icon={Award}
                    stats={[
                        { label: "YTD Runs", value: athleteStats.ytd_run_totals.count },
                        { label: "YTD Distance", value: formatDistance(ytdDistance) },
                        { label: "YTD Time", value: formatDuration(athleteStats.ytd_run_totals.moving_time) },
                        { label: "YTD Elevation", value: `${athleteStats.ytd_run_totals.elevation_gain.toFixed(0)} m` }
                    ]}
                />

                <StatCard 
                    title="Recent Runs"
                    icon={Zap}
                    stats={[
                        { label: "Recent Runs", value: athleteStats.recent_run_totals.count },
                        { label: "Recent Distance", value: formatDistance(recentRunsTotal) },
                        { label: "Recent Time", value: formatDuration(athleteStats.recent_run_totals.moving_time) },
                        { label: "Recent Elevation", value: `${athleteStats.recent_run_totals.elevation_gain.toFixed(0)} m` }
                    ]}
                />
            </div>
            <WeeklyDistanceChart /> 
        </div>
    )
}