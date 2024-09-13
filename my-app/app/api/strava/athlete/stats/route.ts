/*
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
        const errorText = await response.text()
        console.error('Failed to fetch athlete stats:', response.status, errorText)
        throw new Error(`Failed to fetch athlete stats: ${response.status} ${errorText}`)
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
        const response = await fetch('https://www.strava.com/api/v3/athletes/me/stats', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch athlete stats')
        }

        const stats = await response.json()
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Error fetching Strava athlete stats:', error)
        return NextResponse.json({ error: 'Failed to fetch athlete stats', details: error.message }, { status: 500 })
    }
}*/
