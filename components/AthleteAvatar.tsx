import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { LogOut, User } from "lucide-react"

interface Athlete {
    id: number
    city: string
    firstname: string
    lastname: string
    profile: string
}

interface AthleteAvatarProps {
    athlete: Athlete
    onLogout: () => void
}

export function AthleteAvatar({ athlete, onLogout }: AthleteAvatarProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={athlete.profile} alt={`${athlete.firstname} ${athlete.lastname}`} />
                        <AvatarFallback>{athlete.firstname[0]}{athlete.lastname[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex justify-start items-center space-x-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={athlete.profile} alt={`${athlete.firstname} ${athlete.lastname}`} />
                        <AvatarFallback>{athlete.firstname[0]}{athlete.lastname[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-sm">{athlete.firstname} {athlete.lastname}</h4>
                        <p className="text-sm text-muted-foreground">{athlete.city}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-sm font-medium">Athlete ID: {athlete.id}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}