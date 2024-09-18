import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity } from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

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
        <Card className="w-full bg-black text-white border h-[calc(100vh-12rem)]" >
            <CardHeader className="py-3 text-lg">
                <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-6 w-6 "/>
                    <span>Recent Activities</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Elevation</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity) => (
                            <TableRow key={activity.id} className="text-white border-b">
                                <TableCell className="font-medium">{activity.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span>{activity.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span>{formatDistance(activity.distance)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span>{formatDuration(activity.moving_time)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span>{activity.total_elevation_gain.toFixed(0)} m</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span>{formatDate(activity.start_date_local)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {activity.start_latlng && Array.isArray(activity.start_latlng) && activity.start_latlng.length === 2 ? (
                                        <div className="flex items-center space-x-2">
                                            <span>
                                                    {activity.start_latlng[0].toFixed(2)}, {activity.start_latlng[1].toFixed(2)}
                                                </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <span>No location data</span>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}