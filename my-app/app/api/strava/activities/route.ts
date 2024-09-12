import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function refreshAccessToken(refreshToken: string) {
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

export async function GET() {
    const cookieStore = cookies()
    let accessToken = cookieStore.get('strava_access_token')?.value
    const refreshToken = cookieStore.get('strava_refresh_token')?.value

    if (!accessToken && refreshToken) {
        try {
            accessToken = await refreshAccessToken(refreshToken)
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
    
    try {
        const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=5', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        })
        
        if (!response.ok) {
            throw new Error('Failed to fetch activities')
        }

        const activities = await response.json()
        return NextResponse.json(activities)
    } catch (error) {
        console.error('Error fetching Strava activities:', error)
        return NextResponse.json({ error: 'Failed to authenticate with Strava', details: error.message }, { status: 500 })
    }
}