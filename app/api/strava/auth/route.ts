import { NextResponse } from 'next/server'

export async function GET() {
    const clientId = process.env.STRAVA_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/strava/callback`
    const scope = 'read,activity:read_all'
    
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=force&scope=${scope}`
    console.log('Authorization URL:', authUrl)
    
    return NextResponse.redirect(authUrl)
}

//When deploying to production, the website needs to be changed on Strava API settings to be the full name of the website it redirects to, + /api/strava/callback