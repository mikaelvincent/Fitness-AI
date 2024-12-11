import { KeyRound, LogOut, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfileDashboardUI() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-4 lg:p-8">
      {/* Profile Section */}
      <Card className="border-zinc-100 bg-zinc-300 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Madison</h1>
              <p className="text-muted-foreground">madisons@example.com</p>
            </div>

            {/* Stats Grid - Vertical on mobile, horizontal on desktop */}
            <div className="flex justify-center">
              <div className="flex w-full flex-col rounded-lg bg-orange-500 lg:w-1/2">
                <div className="p-4">
                  <p className="text-2xl font-bold">75 Kg</p>
                  <p className="text-sm text-orange-100">Weight</p>
                </div>
                <div className="border-orange-400 p-4 md:border-l-0 md:border-t">
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-sm text-orange-100">Age</p>
                </div>
                <div className="border-orange-400 p-4 md:border-l-0 md:border-t">
                  <p className="text-2xl font-bold">1.65 Cm</p>
                  <p className="text-sm text-orange-100">Height</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Actions Section */}
      <Card className="border-zinc-100 bg-zinc-300 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-zinc-800 hover:text-orange-500"
            >
              <div className="mr-4 rounded-full bg-orange-500 p-2">
                <User className="h-5 w-5" />
              </div>
              Update Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-zinc-800 hover:text-orange-500"
            >
              <div className="mr-4 rounded-full bg-orange-500 p-2">
                <KeyRound className="h-5 w-5" />
              </div>
              Change Password
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-zinc-800 hover:text-orange-500"
            >
              <div className="mr-4 rounded-full bg-orange-500 p-2">
                <Shield className="h-5 w-5" />
              </div>
              Two-Factor Authentication
            </Button>
            <Separator className="my-4 bg-zinc-800" />
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-zinc-800 hover:text-orange-500"
            >
              <div className="mr-4 rounded-full bg-orange-500 p-2">
                <LogOut className="h-5 w-5" />
              </div>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
