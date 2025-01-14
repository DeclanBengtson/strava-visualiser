'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import StravaAuthButton from '../components/StravaAuthButton';

interface DashboardClientProps {
    isAuthenticated: boolean;
}

export default function DashboardClient({ isAuthenticated }: DashboardClientProps) {
    const router = useRouter();
    
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/strava-dashboard');
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Dashboard</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Connect your Strava account to see your activities.
                    </p>
                    <StravaAuthButton />
                </div>
            </div>
        </div>
    );
}