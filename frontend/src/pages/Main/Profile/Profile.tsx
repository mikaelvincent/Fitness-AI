// Profile.tsx
import ProfileDashboardUI from "@/components/profile/ProfileDashboardUI.tsx";
import { UserProfileInfo } from "@/types/UserProfileInfo.ts";
import { useState } from "react";
import { calculateAge } from "@/utils/calculateAge.ts";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState<UserProfileInfo>({
    name: "Jericho",
    email: "pascojericho@gmail.com",
    age: calculateAge(new Date("2000-12-31")),
    weight: 65,
    height: 1.7,
  });

  const [isUpdateName, setIsUpdateName] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleEditName = () => {
    setIsUpdateName(true);
  };

  const handleSaveName = () => {
    // Implement save logic here, e.g., API call to update the name
    // For now, we'll just exit the edit mode
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
    />
  );
};

export default Profile;
