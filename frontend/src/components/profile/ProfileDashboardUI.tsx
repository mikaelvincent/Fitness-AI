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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { UpdateNameSchema } from "@/utils/schema/UpdateName.ts";

export interface ProfileDashboardUIProps {
  profileInfo: UserProfileInfo;
  isUpdateName: boolean;
  onEditName: () => void;
  onSaveName: any;
  onCancelEditName: () => void;
  handleNavigation: (path: string) => void;
  attributes: Attribute[]; // Updated to an array of Attribute objects
  form: UseFormReturn<z.infer<typeof UpdateNameSchema>>;
}

export default function ProfileDashboardUI({
  profileInfo,
  isUpdateName,
  onEditName,
  onSaveName,
  onCancelEditName,
  handleNavigation,
  attributes,
  form,
}: ProfileDashboardUIProps) {
  return (
    <div className="flex h-screen w-full flex-col justify-start gap-8 p-4 lg:p-8 xl:justify-center">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <div className="flex h-1/2 w-full flex-col gap-2 xl:h-4/6 xl:flex-row">
        {/* Profile Section */}
        <Card className="h-auto border-zinc-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 lg:flex-none xl:h-full xl:w-1/3">
          <CardContent className="flex h-1/2 flex-col justify-between p-6 sm:h-full">
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSaveName)}
                      className="flex w-full"
                      noValidate
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full flex-1">
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-initial">
                        <Button type="submit" variant="ghost">
                          <Save className="text-primary" />
                        </Button>
                        <Button variant="ghost" onClick={onCancelEditName}>
                          <X className="text-red-500" />
                        </Button>
                      </div>
                    </form>
                  </Form>
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
        <Card className="h-4/6 flex-none border-zinc-100 bg-gray-50 text-center dark:border-zinc-800 dark:bg-zinc-900 lg:h-full lg:flex-1">
          <CardContent className="h-full p-6">
            <div className="h-full flex-col">
              <div className="flex w-full justify-end p-0">
                <Button variant="link" size="lg" asChild>
                  <Link
                    to="/chat"
                    className="flex h-auto items-center gap-1 px-0 pb-2"
                  >
                    <BotMessageSquare />
                    Chat with GENIE to update your attributes
                  </Link>
                </Button>
              </div>
              <div className="flex h-5/6 w-full flex-col rounded-lg bg-primary">
                <ScrollArea className="h-full w-full p-4">
                  {attributes && attributes.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {attributes.map((attribute, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 rounded border-zinc-800 p-4 shadow dark:bg-zinc-900 sm:flex-row"
                        >
                          <p className="w-full text-wrap text-center text-lg capitalize text-orange-900 dark:text-orange-400 md:text-start lg:w-1/2">
                            {attribute.name}
                          </p>
                          <p className="w-full text-wrap text-center text-xl capitalize md:text-start lg:w-1/2">
                            {attribute.value}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
