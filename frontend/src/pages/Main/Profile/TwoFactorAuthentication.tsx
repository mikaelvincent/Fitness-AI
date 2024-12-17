// TwoFactorAuthentication.tsx
import { useEffect, useState } from "react";
import TwoFactorAuthUI from "@/components/profile/twoFactorAuthencation/TwoFactorAuthUI.tsx";
import {
  EnableTwoFactorAuth,
  EnableTwoFactorAuthResponse,
} from "@/services/auth/twoFactorAuth/enableTwoFactorAuth.ts";
import { DisableTwoFactorAuth } from "@/services/auth/twoFactorAuth/disableTwoFactorAuth.ts";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { toast } from "@/hooks/use-toast.tsx";
import { ConfirmTwoFactorAuth } from "@/services/auth/twoFactorAuth/confirmTwoFactorAuth.ts";

export const TwoFactorAuthentication = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const { token, refreshToken } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Fetch current 2FA status on component mount
  useEffect(() => {
    fetch2FAStatus().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refreshToken();
  }, []);

  const fetch2FAStatus = async () => {
    try {
      const response: EnableTwoFactorAuthResponse =
        await EnableTwoFactorAuth(token);

      if (
        !response?.success &&
        response.message === "Two-factor authentication is already enabled."
      ) {
        setIs2FAEnabled(true);
        if (response.data) {
          setRecoveryCodes(response.data.recovery_codes);
        }
        return;
      }

      setIs2FAEnabled(false);
    } catch (err) {
      console.error("Error fetching 2FA status:", err);
      toast({
        variant: "destructive",
        title: "Error Fetching 2FA Status",
        description: "Failed to retrieve two-factor authentication status.",
      });
    }
  };

  // Handle toggle action from the UI
  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      // User is attempting to enable 2FA
      initializeEnable2FA().then((r) => r);
      refreshToken();
      // Do not set is2FAEnabled here
    } else {
      // User is attempting to disable 2FA
      disable2FA().then((r) => r);
      refreshToken();
    }
  };

  const initializeEnable2FA = async () => {
    try {
      const response: EnableTwoFactorAuthResponse =
        await EnableTwoFactorAuth(token);

      if (!response?.success) {
        toast({
          variant: "destructive",
          title: response?.message || "Error Activating 2FA",
          description: "Failed to initiate two-factor authentication.",
        });
        return;
      }

      // Do not set is2FAEnabled to true here
      if (response.data) {
        setQrCode(response.data.qr_code_url);
        setRecoveryCodes(response.data.recovery_codes);
      }

      // Open the modal for user to confirm 2FA
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error during initializing 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Initializing 2FA",
        description: "Failed to initiate two-factor authentication.",
      });
    }
  };

  // Step 2: Confirm enabling 2FA with the verification code
  const confirmEnable2FA = async () => {
    try {
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
        // Optionally reset QR codes and recovery codes
        setQrCode(null);
        setRecoveryCodes(null);
        return;
      }

      // Success: Enable 2FA
      setIs2FAEnabled(true);
      toast({
        title: "Two-Factor Authentication Activated",
        description: "Two-factor authentication has been enabled successfully.",
      });
      refreshToken();
    } catch (err) {
      console.error("Error during confirming 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Confirming 2FA",
        description: "Failed to confirm two-factor authentication.",
      });
      // Optionally reset QR codes and recovery codes
      setQrCode(null);
      setRecoveryCodes(null);
    } finally {
      setVerificationCode("");
      setIsModalOpen(false);
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
        // Revert the toggle in UI by fetching the latest status
        await fetch2FAStatus();
        return;
      }

      // Success Toast
      toast({
        title: "Two-Factor Authentication Deactivated",
        description:
          "Two-factor authentication has been disabled successfully.",
      });

      // Update state based on action
      setIs2FAEnabled(false);
      setQrCode(null);
      setRecoveryCodes(null);
      refreshToken();
    } catch (err) {
      console.error("Error during disabling 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Disabling 2FA",
        description: "Failed to disable two-factor authentication.",
      });
      // Revert the toggle in UI by fetching the latest status
      await fetch2FAStatus();
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
        confirmEnable2FA={confirmEnable2FA}
        backButtonHref={"/profile"}
      />
    </>
  );
};
