// ProfileDashboardUI.tsx
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
import { Attribute, UserProfileInfo } from "@/types/UserProfileInfo";
import LogoutButton from "@/components/authentication/LogoutButton";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface ProfileDashboardUIProps {
  profileInfo: UserProfileInfo;
  isUpdateName: boolean;
  onEditName: () => void;
  onSaveName: () => void;
  onCancelEditName: () => void;
  onNameChange: (newName: string) => void;
  handleNavigation: (path: string) => void;
  attributes: Attribute[]; // Updated to an array of Attribute objects
}

export default function ProfileDashboardUI({
  profileInfo,
  isUpdateName,
  onEditName,
  onSaveName,
  onCancelEditName,
  onNameChange,
  handleNavigation,
  attributes,
}: ProfileDashboardUIProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-4 lg:p-8">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <div className="flex h-4/6 w-full gap-2">
        {/* Profile Section */}
        <Card className="w-1/3 flex-none border-zinc-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex flex-1 flex-col justify-center space-y-2">
              {!isUpdateName ? (
                <div className="flex justify-between">
                  <h1 className="text-2xl font-bold">{profileInfo.name}</h1>
                  <Button variant="ghost" onClick={onEditName}>
                    <Edit className="text-primary" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <Input
                    type="text"
                    className="text-2xl font-bold"
                    value={profileInfo.name}
                    onChange={(e) => onNameChange(e.target.value)}
                  />
                  <div className="flex">
                    <Button variant="ghost" onClick={onSaveName}>
                      <Save className="text-primary" />
                    </Button>
                    <Button variant="ghost" onClick={onCancelEditName}>
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
                className="w-full justify-start py-10 text-lg hover:bg-secondary hover:text-primary"
                onClick={() => handleNavigation("change-password")}
              >
                <div className="mr-4 rounded-full bg-primary p-2">
                  <KeyRound className="h-5 w-5" />
                </div>
                Change Password
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start py-10 text-lg hover:bg-secondary hover:text-primary"
                onClick={() => handleNavigation("two-factor-authentication")}
              >
                <div className="mr-4 rounded-full bg-primary p-2">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex-col text-start">
                  <p>Two-Factor </p>
                  <p>Authentication</p>
                </div>
              </Button>
              <Separator className="my-4 bg-zinc-800" />
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
        {/* Attributes Section */}
        <Card className="flex-1 border-zinc-100 bg-gray-50 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="h-full p-6">
            <div className="h-full flex-col">
              <div className="flex h-5/6 w-full flex-col rounded-lg bg-primary">
                <ScrollArea className="h-full w-full">
                  {attributes && attributes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {attributes.map((attribute, index) => (
                        <div key={index} className="rounded p-4 shadow">
                          <p className="text-2xl font-semibold">
                            {attribute.value}
                          </p>
                          <p className="text-sm text-orange-200">
                            {attribute.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-white">
                      No Attributes
                    </div>
                  )}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
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
