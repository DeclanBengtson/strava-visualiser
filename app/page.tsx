import { cookies } from 'next/headers'
import StravaAuthButton from '../components/StravaAuthButton.tsx'
import StravaData from '../components/StravaData.tsx'

export default function Dashboard() {
    const cookieStore = cookies()
    const isAuthenticated = !!cookieStore.get('strava_refresh_token')
    console.log(cookieStore)
    
    return (
        <div className="container mx-auto p-4">
            
            {isAuthenticated ? (
                <StravaData />
            ) : (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                    <p className="mb-4">Connect your Strava account to see your activities.</p>
                    <StravaAuthButton/>
                </div>
            )}
        </div>
    )
}