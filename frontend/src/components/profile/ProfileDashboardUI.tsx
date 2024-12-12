import {
  BotMessageSquare,
  Edit,
  KeyRound,
  Save,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme/ModeToggle.tsx";
import { UserProfileInfo } from "@/types/UserProfileInfo";
import LogoutButton from "@/components/authentication/LogoutButton";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ProfileDashboardUIProps {
  profileInfo: UserProfileInfo;
  handleNavigation: (path: string) => void;
}

export default function ProfileDashboardUI({
  profileInfo,
  handleNavigation,
}: ProfileDashboardUIProps) {
  const [isUpdateName, setIsUpdateName] = useState<boolean>(false);

  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-4 lg:p-8">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <div className="flex w-full gap-2">
        {/* Profile Section */}
        <Card className="w-1/3 flex-none border-zinc-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex flex-1 flex-col justify-center space-y-2">
              {!isUpdateName && (
                <div className="flex justify-between">
                  <h1 className="text-2xl font-bold">{profileInfo.name}</h1>
                  <Button variant="ghost" onClick={() => setIsUpdateName(true)}>
                    <Edit className="text-primary" />
                  </Button>
                </div>
              )}
              {isUpdateName && (
                <div className="flex justify-between">
                  <Input
                    type="text"
                    className="text-2xl font-bold"
                    value={profileInfo.name}
                    onChange={(e) => console.log(e.target.value)}
                  />
                  <div className="flex">
                    <Button
                      variant="ghost"
                      onClick={() => setIsUpdateName(false)}
                    >
                      <Save className="text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsUpdateName(false)}
                    >
                      <X className="text-red-500" />
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground">{profileInfo.email}</p>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-lg hover:bg-secondary hover:text-primary"
                onClick={() => handleNavigation("change-password")}
              >
                <div className="mr-4 rounded-full bg-primary p-2">
                  <KeyRound className="h-5 w-5" />
                </div>
                Change Password
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-lg hover:bg-secondary hover:text-primary"
                onClick={() => handleNavigation("two-factor-authentication")}
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
        {/* Actions Section */}
        <Card className="flex-1 border-zinc-100 bg-gray-50 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="p-6">
            {/* Stats Grid - Vertical on mobile, horizontal on desktop */}
            <div className="flex-col">
              <div className="flex w-full flex-col rounded-lg bg-primary">
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
              <div className="mt-4 flex w-full justify-end">
                <Button variant="link" size="lg">
                  <Link to="/chat" className="flex items-center gap-1">
                    <BotMessageSquare />
                    Chat with GENIE to update your attributes
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
