import { cookies } from 'next/headers';
import StravaAuthButton from '../components/StravaAuthButton.tsx';
import StravaData from '../components/StravaData.tsx';

export default function Dashboard() {
    const cookieStore = cookies();
    const isAuthenticated = !!cookieStore.get('strava_refresh_token');
    console.log(cookieStore);
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-* bg-white shadow-lg rounded-lg p-8">
            {isAuthenticated ? (
                <StravaData />
            ) : (
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Dashboard</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Connect your Strava account to see your activities.
                        </p>
                        <StravaAuthButton />
                </div>
            )}
        </div>
        </div>
    );
}