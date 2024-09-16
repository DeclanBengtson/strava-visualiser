import { NextResponse } from 'next/server'
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
export async function GET() {
    const cookieStore = cookies()
    const accessToken: string | undefined = cookieStore.get('strava_access_token')?.value
    const refreshToken = cookieStore.get('strava_refresh_token')?.value

    if (!refreshToken) {
        try {
            const accessToken = await refreshAccessToken(refreshToken)
            cookies().set('strava_access_token', accessToken, {
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
    
    
        const [activities, athleteStats] = await Promise.all ([
            fetchStravaData(accessToken, 'athlete/activities?per_page=100'),      
            fetchStravaData(accessToken, 'athletes/29745314/stats')
            ])
    
    return NextResponse.json({ activities, athleteStats })
}

//athleteStats