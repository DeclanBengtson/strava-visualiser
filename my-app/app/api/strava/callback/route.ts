import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
   // const error = searchParams.get('error')

    console.log('Callback URL:', request.url) // Log the full callback URL
    console.log('Search Params:', Object.fromEntries(searchParams.entries())) // Log all query parameters
    console.log('This is the code ' + code)
    
    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    }

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code'
        }),
    })

    const tokenData = await tokenResponse.json()
    console.log(tokenData)

    // Store tokens in secure HTTP-only cookies
    cookies().set('strava_access_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: tokenData.expires_in
    })
    cookies().set('strava_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 365 * 24 * 60 * 60 // 1 year
    })

    // Log cookies after setting
    console.log('Cookies after setting:', cookies().getAll())

    // Here, you would typically store tokenData.access_token and tokenData.refresh_token
    // in a secure place like a database

    return NextResponse.redirect('http://localhost:3000/')
}