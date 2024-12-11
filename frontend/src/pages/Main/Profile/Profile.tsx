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

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <ProfileDashboardUI
        profileInfo={profileInfo}
        handleNavigation={handleNavigation}
      />
    </>
  );
};

export default Profile;
