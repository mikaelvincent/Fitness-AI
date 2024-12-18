// Profile.tsx
import ProfileDashboardUI from "@/features/profile/components/ProfileDashboardUI";
import { Attribute, UserProfileInfo } from "@/shared/types/UserProfileInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RetrieveAttributes } from "@/shared/services/User/RetreiveAllAttributes";
import { useUser } from "@/shared/hooks/context/UserContext";
import { toast } from "@/shared/hooks/use-toast";
import { UpdateNameSchema } from "@/shared/utils/schema/UpdateName";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateName } from "@/shared/services/User/UpdateName";
import { FetchUserInfo } from "@/shared/services/User/FetchUserInfo";
import { LoadingSpinner } from "@/shared/components/ui/loading-spinner";

const Profile = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [profileInfo, setProfileInfo] = useState<UserProfileInfo>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { token, refreshToken } = useUser();

  const [isUpdateName, setIsUpdateName] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof UpdateNameSchema>>({
    resolver: zodResolver(UpdateNameSchema),
    defaultValues: {
      name: profileInfo.name,
    },
  });

  useEffect(() => {
    handleRetrieveAttributes().then((r) => r);
    fetchUserInfo().then((r) => r);
  }, []);

  useEffect(() => {
    // Reset the form with the updated profileInfo
    form.reset({
      name: profileInfo.name,
    });
  }, [profileInfo, form]);

  const fetchUserInfo = async () => {
    refreshToken();
    setLoading(true);
    try {
      const response = await FetchUserInfo({ token });

      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Failed to retrieve User Info",
        });
        return;
      }

      if (response?.success) {
        setProfileInfo(response.data as UserProfileInfo);
        return;
      }

      // Handle the case where response.success is true but response.data is undefined
      toast({
        variant: "destructive",
        title: "User Info retrieved but data is missing.",
      });
    } catch (error) {
      console.error("Error retrieving user info:", error);
      toast({
        variant: "destructive",
        title: "Failed to retrieve user info.",
      });
    } finally {
      setLoading(false); // Ensures loading is set to false in all cases
    }
  };

  const handleRetrieveAttributes = async () => {
    refreshToken();
    try {
      const response = await RetrieveAttributes({ token });
      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Failed to retrieve attributes",
        });
        return;
      }

      if (response?.success && response?.data) {
        // Transform the data object into an array of Attribute objects
        const dataObject = response.data as Record<string, string | number>;
        const attributesArray: Attribute[] = Object.entries(dataObject).map(
          ([name, value]) => ({ name, value }),
        );
        setAttributes(attributesArray);
      }
    } catch (error) {
      console.error("Error retrieving attributes:", error);
      toast({
        variant: "destructive",
        title: "Failed to retrieve attributes",
      });
    }
  };

  const handleNavigation = (path: string) => {
    refreshToken();
    navigate(path);
  };

  const handleEditName = () => {
    setIsUpdateName(true);
  };

  const handleSaveName = async (data: z.infer<typeof UpdateNameSchema>) => {
    const { name } = data;
    refreshToken();
    try {
      const response = await UpdateName({ token, name });
      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Failed to update name",
        });
        setIsUpdateName(false);
        // Optionally reset the form or handle as needed
        return;
      }
      if (response?.success) {
        toast({
          title: response?.message || "Name updated successfully",
        });
        setProfileInfo((prev) => ({ ...prev, name }));
        setIsUpdateName(false);
      }
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        variant: "destructive",
        title: "Failed to update name",
      });
    }
  };

  const handleCancelEditName = () => {
    // Optionally reset the name if needed
    setProfileInfo((prev) => ({ ...prev, name: prev.name }));
    setIsUpdateName(false);
  };

  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size={48} className="text-primary" />
    </div>
  ) : (
    profileInfo && (
      <ProfileDashboardUI
        profileInfo={profileInfo}
        isUpdateName={isUpdateName}
        onEditName={handleEditName}
        onSaveName={handleSaveName}
        onCancelEditName={handleCancelEditName}
        handleNavigation={handleNavigation}
        attributes={attributes}
        form={form}
      />
    )
  );
};

export default Profile;
