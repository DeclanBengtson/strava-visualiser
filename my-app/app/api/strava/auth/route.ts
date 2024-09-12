import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const clientId = process.env.STRAVA_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/strava/callback`
    const scope = 'read,activity:read'
    
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=force&scope=${scope}`
    
    return NextResponse.redirect(authUrl)
}