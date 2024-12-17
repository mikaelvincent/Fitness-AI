// Profile.tsx
import ProfileDashboardUI from "@/components/profile/ProfileDashboardUI.tsx";
import { Attribute, UserProfileInfo } from "@/types/UserProfileInfo.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RetrieveAttributes } from "@/services/User/RetreiveAllAttributes.ts";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { toast } from "@/hooks/use-toast.tsx";
import { UpdateNameSchema } from "@/utils/schema/UpdateName.ts";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateName } from "@/services/User/UpdateName.ts";

const Profile = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [profileInfo, setProfileInfo] = useState<UserProfileInfo>({
    name: "Jericho",
    email: "pascojericho@gmail.com",
  });

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
  }, []);

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

  const handleSaveName = async () => {
    refreshToken();
    try {
      const response = await UpdateName({ token, name: profileInfo.name });
      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Failed to update name",
        });
        setIsUpdateName(false);
        setProfileInfo((prev) => ({ ...prev, name: prev.name }));
        return;
      }
      if (response?.success && response?.data) {
        toast({
          title: response?.message || "Name updated successfully",
        });
        setIsUpdateName(false);
        return;
      }
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        variant: "destructive",
        title: "Failed to update name",
      });
      setProfileInfo((prev) => ({ ...prev, name: prev.name }));
    }
    setIsUpdateName(false);
  };

  const handleCancelEditName = () => {
    // Optionally reset the name if needed
    setProfileInfo((prev) => ({ ...prev, name: prev.name }));
    setIsUpdateName(false);
  };

  const handleNameChange = (newName: string) => {
    setProfileInfo((prev) => ({ ...prev, name: newName }));
  };

  return (
    <ProfileDashboardUI
      profileInfo={profileInfo}
      isUpdateName={isUpdateName}
      onEditName={handleEditName}
      onSaveName={handleSaveName}
      onCancelEditName={handleCancelEditName}
      onNameChange={handleNameChange}
      handleNavigation={handleNavigation}
      attributes={attributes}
      form={form}
    />
  );
};

export default Profile;
