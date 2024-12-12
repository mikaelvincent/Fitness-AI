import { useEffect, useState } from "react";
import TwoFactorAuthUI from "@/components/profile/twoFactorAuthencation/TwoFactorAuthUI.tsx";
import {
  EnableTwoFactorAuth,
  EnableTwoFactorAuthResponse,
} from "@/services/auth/twoFactorAuth/enableTwoFactorAuth.ts";
import { DisableTwoFactorAuth } from "@/services/auth/twoFactorAuth/disableTwoFactorAuth.ts";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { toast } from "@/hooks/use-toast.tsx";
import { ConfirmTwoFactorAuth } from "@/services/auth/twoFactorAuth/confirmTwoFactorAuth.ts"; // Ensure this import is correct

export const TwoFactorAuthentication = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const { token } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false); // To track if we're enabling or disabling
  const [verificationCode, setVerificationCode] = useState("");

  // Fetch initial 2FA status when the component mounts
  useEffect(() => {
    const fetch2FAStatus = async () => {
      if (!token) return;
      try {
        const response = await EnableTwoFactorAuth(token); // Consider renaming to fetch2FAStatus for clarity
        if (
          !response?.success &&
          response?.message === "Two-factor authentication is already enabled."
        ) {
          setIs2FAEnabled(true);
          setQrCode(response.data?.qr_code_url || null);
          setRecoveryCodes(response.data?.recovery_codes || null);
        } else {
          setIs2FAEnabled(false);
          setQrCode(null);
          setRecoveryCodes(null);
        }
      } catch (err) {
        console.error("Failed to fetch 2FA status:", err);
        toast({
          variant: "destructive",
          title: "Error Fetching 2FA Status",
          description: "Unable to retrieve two-factor authentication status.",
        });
      }
    };

    fetch2FAStatus();
  }, [token]);

  // Handle toggle action from the UI
  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      // User is attempting to enable 2FA
      setIsEnabling(true);
      setIsModalOpen(true);
    } else {
      // User is attempting to disable 2FA
      disable2FA();
    }
  };

  // Function to handle enabling 2FA after confirmation
  const enable2FA = async () => {
    setIsModalOpen(false);
    try {
      // First, confirm 2FA (this might involve verifying a code or other logic)
      const confirmResponse = await ConfirmTwoFactorAuth({
        token,
        code: verificationCode,
      });
      if (!confirmResponse.success) {
        toast({
          variant: "destructive",
          title: confirmResponse.message || "Confirmation Failed",
          description: "Unable to confirm two-factor authentication.",
        });
        return;
      }

      // Then, enable 2FA
      const response: EnableTwoFactorAuthResponse =
        await EnableTwoFactorAuth(token);

      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Error Activating 2FA",
          description: "Failed to activate two-factor authentication.",
        });
        return;
      }

      // Success Toast
      toast({
        title: response?.message || "Two-Factor Authentication Activated",
        description: "Two-factor authentication has been enabled successfully.",
      });

      // Update state based on action
      setIs2FAEnabled(true);
      if (response.data) {
        setQrCode(response.data.qr_code_url);
        setRecoveryCodes(response.data.recovery_codes);
      }
    } catch (err) {
      console.error("Error during enabling 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Enabling 2FA",
        description: "Failed to enable two-factor authentication.",
      });
    } finally {
      setVerificationCode("");
    }
  };

  // Function to handle disabling 2FA
  const disable2FA = async () => {
    try {
      const response = await DisableTwoFactorAuth(token);

      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Error Disabling 2FA",
          description: "Failed to disable two-factor authentication.",
        });
        return;
      }

      // Success Toast
      toast({
        title: response?.message || "Two-Factor Authentication Deactivated",
        description:
          "Two-factor authentication has been disabled successfully.",
      });

      // Update state based on action
      setIs2FAEnabled(false);
      setQrCode(null);
      setRecoveryCodes(null);
    } catch (err) {
      console.error("Error during disabling 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Disabling 2FA",
        description: "Failed to disable two-factor authentication.",
      });
    }
  };

  return (
    <>
      <TwoFactorAuthUI
        is2FAEnabled={is2FAEnabled}
        qrCode={qrCode}
        recoveryCodes={recoveryCodes}
        handleToggle2FA={handleToggle2FA}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        confirmEnable2FA={enable2FA}
        backButtonHref={"/profile"}
      />
    </>
  );
};
