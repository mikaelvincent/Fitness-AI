import ProfileCardWrapper from "@/components/profile/ProfileCardWrapper.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import AuthErrorMessage from "@/components/authentication/auth-ui/AuthErrorMessage.tsx";
import { Button } from "@/components/ui/button.tsx";
import { UseFormStatusReturn } from "@/hooks/useFormStatus.tsx";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { UpdateProfileSchema } from "@/utils/schema/UpdateProfileSchema";
import { DatePicker } from "@/components/ui/date-picker.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateProfileFormProps {
  status: string;
  formMessage: string;
  formStatus: UseFormStatusReturn;
  form: UseFormReturn<z.infer<typeof UpdateProfileSchema>>;
  onSubmit: (data: z.infer<typeof UpdateProfileSchema>) => void | Promise<void>;
  cooldown: number;
}

export const UpdateProfileForm = ({
  status,
  formMessage,
  formStatus,
  form,
  onSubmit,
  cooldown,
}: UpdateProfileFormProps) => {
  // Determine the message to display
  const getMessage = () => {
    if (status === "error" && cooldown <= 0) {
      return formMessage;
    }

    if (cooldown > 0) {
      return `Too many attempts. Please try again in ${cooldown} second${
        cooldown !== 1 ? "s" : ""
      }.`;
    }

    return "";
  };

  // Determine if there's a message to display
  const displayMessage = (status === "error" && cooldown <= 0) || cooldown > 0;

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <ProfileCardWrapper title="Update Profile" backButtonHref="/profile">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Enter weight"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Enter height"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="physical_activity_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical Activity Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {displayMessage && (
                <AuthErrorMessage formMessage={getMessage()} />
              )}
              <Button
                type="submit"
                className="mb-4 w-full"
                disabled={cooldown > 0 || formStatus.pending}
              >
                {cooldown > 0
                  ? `Please Wait (${cooldown}s)`
                  : status === "loading"
                    ? "Updating..."
                    : "Update"}
              </Button>
            </form>
          </Form>
        </ProfileCardWrapper>
      </div>
    </>
  );
};
