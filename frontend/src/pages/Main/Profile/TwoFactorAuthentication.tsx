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

  // Handle toggle action from the UI
  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      // User is attempting to enable 2FA
      initializeEnable2FA().then((r) => r);
      refreshToken();
    } else {
      // User is attempting to disable 2FA
      disable2FA().then((r) => r);
      refreshToken();
    }
  };

  useEffect(() => {
    toggled2FA().then((r) => r);
    refreshToken();
  }, []);

  const toggled2FA = async () => {
    try {
      const response: EnableTwoFactorAuthResponse =
        await EnableTwoFactorAuth(token);

      if (
        !response?.success &&
        response.message === "Two-factor authentication is already enabled."
      ) {
        setIs2FAEnabled(true);
        return;
      }

      setIs2FAEnabled(false);
    } catch (err) {
      console.error("Error during initializing 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Initializing 2FA",
        description: "Failed to initiate two-factor authentication.",
      });
    }
  };

  // Step 1: Initialize enabling 2FA by fetching QR code and recovery codes
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

      // Update state with QR code and recovery codes
      setIs2FAEnabled(true);
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
    setIsModalOpen(false);
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
        // Optionally disable 2FA since confirmation failed
        setIs2FAEnabled(false);
        setQrCode(null);
        setRecoveryCodes(null);
        return;
      }

      // Success Toast
      toast({
        title: "Two-Factor Authentication Activated",
        description: "Two-factor authentication has been enabled successfully.",
      });
    } catch (err) {
      console.error("Error during confirming 2FA:", err);
      toast({
        variant: "destructive",
        title: "Error Confirming 2FA",
        description: "Failed to confirm two-factor authentication.",
      });
      // Optionally disable 2FA since confirmation failed
      setIs2FAEnabled(false);
      setQrCode(null);
      setRecoveryCodes(null);
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
        title: "Two-Factor Authentication Deactivated",
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
        confirmEnable2FA={confirmEnable2FA}
        backButtonHref={"/profile"}
      />
    </>
  );
};
