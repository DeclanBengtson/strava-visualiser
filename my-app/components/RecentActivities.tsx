import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Activity, ChevronLeft, ChevronRight} from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useState, useEffect} from "react";
import { Button } from "@/components/ui/button"

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
    initialActivities: StravaActivity[]
    formatDate: (dateString: string) => string
    formatDuration: (seconds: number) => string
    formatDistance: (distance: number) => string
    initialPage: number
    initialPerPage: number
}

export function RecentActivities({ initialActivities, formatDate, formatDuration, formatDistance, initialPage, initialPerPage }: RecentActivitiesProps) {
    const [activities, setActivities] = useState<StravaActivity[]>(initialActivities)
    const [page, setPage] = useState(initialPage)
    const [perPage, setPerPage] = useState(initialPerPage)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchActivities = async (pageNum: number) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/strava/activities?page=${pageNum}&per_page=${perPage}`)
            if (!response.ok) {
                throw new Error('Failed to fetch activities')
            }
            const data = await response.json()
            if (Array.isArray(data.paginatedActivities)) {
                setActivities(data.paginatedActivities)
                setPage(pageNum)
            } else {
                throw new Error('Invalid response format')
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
            setError('Failed to load activities. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities(page)
    }, [])
    
    const handlePrevPage = () => {
        if (page > 1) {
            fetchActivities(page - 1)
        }
    }

    const handleNextPage = () => {
        fetchActivities(page + 1)
    }
    return (
        <Card className="w-full h-[calc(100vh-12rem)] bg-black text-white">
            <CardHeader className="py-3">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-lg">
                        <Activity className="h-5 w-5"/>
                        <span>Recent Activities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handlePrevPage}
                            disabled={page === 1 || loading}
                            variant="outline"
                            size="sm"
                            className="p-0 w-8 h-8"
                        >
                            <ChevronLeft className="h-4 w-4 text-zinc-950" />
                        </Button>
                        <span className="text-sm">Page {page}</span>
                        <Button
                            onClick={handleNextPage}
                            disabled={loading || (activities && activities.length < perPage)}
                            variant="outline"
                            size="sm"
                            className="p-0 w-8 h-8"
                        >
                            <ChevronRight className="h-4 w-4 text-zinc-950" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-gray-800">
                                <TableHead className="font-bold text-gray-300">Name</TableHead>
                                <TableHead className="font-bold text-gray-300">Type</TableHead>
                                <TableHead className="font-bold text-gray-300">Distance</TableHead>
                                <TableHead className="font-bold text-gray-300">Duration</TableHead>
                                <TableHead className="font-bold text-gray-300">Elevation</TableHead>
                                <TableHead className="font-bold text-gray-300">Date</TableHead>
                                <TableHead className="font-bold text-gray-300">Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        Loading activities...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4 text-red-500">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : activities && activities.length > 0 ? (
                                activities.map((activity) => (
                                    <TableRow key={activity.id} className="border-b border-gray-800">
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        No activities found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}