import ProfileDashboardUI from "@/components/profile/ProfileDashboardUI.tsx";
import { UserProfileInfo } from "@/types/UserProfileInfo.ts";
import { useState } from "react";
import { calculateAge } from "@/utils/calculateAge.ts";

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState<UserProfileInfo>({
    name: "Jericho",
    email: "pascojericho@gmail.com",
    age: calculateAge(new Date("2000-12-31")),
    weight: 65,
    height: 1.7,
  });

  return (
    <>
      <ProfileDashboardUI profileInfo={profileInfo} />
    </>
  );
};

export default Profile;
