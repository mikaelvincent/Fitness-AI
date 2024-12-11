import { KeyRound, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme/ModeToggle.tsx";
import { UserProfileInfo } from "@/types/UserProfileInfo";
import LogoutButton from "@/components/authentication/LogoutButton";

interface ProfileDashboardUIProps {
  profileInfo: UserProfileInfo;
}

export default function ProfileDashboardUI({
  profileInfo,
}: ProfileDashboardUIProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-4 lg:p-8">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      {/* Profile Section */}
      <Card className="border-zinc-100 bg-gray-50 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{profileInfo.name}</h1>
              <p className="text-muted-foreground">{profileInfo.email}</p>
            </div>

            {/* Stats Grid - Vertical on mobile, horizontal on desktop */}
            <div className="flex justify-center">
              <div className="flex w-full flex-col rounded-lg bg-primary lg:w-1/2">
                <div className="p-4">
                  <p className="text-2xl font-bold">{profileInfo.age}</p>
                  <p className="text-sm text-orange-100">Age</p>
                </div>
                <div className="border-orange-400 p-4 md:border-l-0 md:border-t">
                  <p className="text-2xl font-bold">{profileInfo.weight}</p>
                  <p className="text-sm text-orange-100">Weight</p>
                </div>
                <div className="border-orange-400 p-4 md:border-l-0 md:border-t">
                  <p className="text-2xl font-bold">{profileInfo.height}</p>
                  <p className="text-sm text-orange-100">Height</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Actions Section */}
      <Card className="border-zinc-100 bg-gray-50 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-secondary hover:text-primary"
            >
              <div className="mr-4 rounded-full bg-primary p-2">
                <User className="h-5 w-5" />
              </div>
              Update Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-secondary hover:text-primary"
            >
              <div className="mr-4 rounded-full bg-primary p-2">
                <KeyRound className="h-5 w-5" />
              </div>
              Change Password
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-secondary hover:text-primary"
            >
              <div className="mr-4 rounded-full bg-primary p-2">
                <Shield className="h-5 w-5" />
              </div>
              Two-Factor Authentication
            </Button>
            <Separator className="my-4 bg-zinc-800" />
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
