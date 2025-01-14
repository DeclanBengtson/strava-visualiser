import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

export default function Dashboard() {
    const cookieStore = cookies();
    const isAuthenticated = !!cookieStore.get('strava_refresh_token');
    
    return <DashboardClient isAuthenticated={isAuthenticated} />;
}