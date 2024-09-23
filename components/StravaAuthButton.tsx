'use client'

import { Button } from "@/components/ui/button"

export default function StravaAuthButton() {
    const handleAuth = () => {
        window.location.href = '/api/strava/auth'
    }
    
    return (
        <Button onClick={handleAuth} className="bg-[#FC4C02] hover:bg-[#FC4C02]/80 text-white">
            Connect with Strava
        </Button>
    )
}