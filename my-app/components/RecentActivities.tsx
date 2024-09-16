import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Bike, Calendar, Clock, MapPin, TrendingUp } from 'lucide-react'

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

interface RecentActivitiesProps {
    activities: StravaActivity[]
    formatDate: (dateString: string) => string
    formatDuration: (seconds: number) => string
    formatDistance: (distance: number) => string
}

export function RecentActivities({ activities, formatDate, formatDuration, formatDistance }: RecentActivitiesProps) {
    return (
        <Card className="h-[calc(100vh-2rem)] flex flex-col">
            <CardHeader className="sticky top-0 z-10 bg-white border-b">
                <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-6 w-6"/>
                    <span>Recent Activities</span>
                </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-grow">
                <div className="space-y-4 p-4">
                    {activities.map((activity) => (
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
    )
}