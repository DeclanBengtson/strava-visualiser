import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    console.log("REFRESHING ACCESS TOKEN...")
    const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    return data.access_token
}

async function fetchStravaData(accessToken: string, endpoint: string) {
    const response = await fetch(`https://www.strava.com/api/v3/${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.status}`)
    }

    return response.json()
}

export async function GET(request: NextRequest) {
    const cookieStore = cookies()
    const accessToken: string | undefined = cookieStore.get('strava_access_token')?.value
    const refreshToken = cookieStore.get('strava_refresh_token')?.value

    if (!accessToken && refreshToken) {
        try {
            const newAccessToken = await refreshAccessToken(refreshToken)
            cookies().set('strava_access_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600 // 1 hour
            })
        } catch (error) {
            console.error('Failed to refresh access token:', error)
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
        }
    }

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams
        const before = searchParams.get('before') || Math.floor(Date.now() / 1000).toString()
        const perPage = parseInt(searchParams.get('per_page') || '30', 10)
        const limit = parseInt(searchParams.get('limit') || '200', 10)

        // Ensure perPage is a valid number
        if (isNaN(perPage) || perPage < 1 || perPage > 200) {
            return NextResponse.json({ error: 'Invalid per_page parameter' }, { status: 400 })
        }

        // First, fetch the athlete data to get the ID
        const athlete = await fetchStravaData(accessToken, 'athlete')

        // Fetch stats
        const athleteStats = await fetchStravaData(accessToken, `athletes/${athlete.id}/stats`)

        // Fetch activities for chart (up to the limit)
        const chartActivities = await fetchStravaData(accessToken, `athlete/activities?before=${before}&per_page=${perPage}`)

        // Fetch the most recent activities for the paginated view
        // const paginatedActivities = await fetchStravaData(accessToken, `athlete/activities?per_page=${perPage}`)

        return NextResponse.json({
            //paginatedActivities,
            chartActivities,
            athleteStats,
            athlete,
            before,
            perPage,
            limit
        })
    } catch (error) {
        console.error('Failed to fetch Strava data:', error)
        return NextResponse.json({ error: 'Failed to fetch Strava data' }, { status: 500 })
    }
}

