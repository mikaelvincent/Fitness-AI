import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Clipboard } from "lucide-react"; // Added Clipboard icon
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // Import useState for copy functionality

interface TwoFactorAuthPageProps {
  is2FAEnabled: boolean;
  qrCode: string | null; // Assuming this is the secret key
  recoveryCodes: string[] | null;
  handleToggle2FA: (checked: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  confirmEnable2FA: () => void;
  backButtonHref: string;
}

const TwoFactorAuthUI = ({
  is2FAEnabled,
  qrCode,
  recoveryCodes,
  handleToggle2FA,
  isModalOpen,
  setIsModalOpen,
  verificationCode,
  setVerificationCode,
  confirmEnable2FA,
  backButtonHref,
}: TwoFactorAuthPageProps) => {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState<string>("");

  const handleCopy = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode).then(
        () => {
          setCopySuccess("Copied!");
          setTimeout(() => setCopySuccess(""), 2000);
        },
        () => {
          setCopySuccess("Failed to copy!");
          setTimeout(() => setCopySuccess(""), 2000);
        },
      );
    }
  };

  const extractSecretKey = (otpauthUrl: string) => {
    try {
      const url = new URL(otpauthUrl);
      const secret = url.searchParams.get("secret");
      return secret || "Secret not found in URL";
    } catch (error) {
      return "Invalid OTPAuth URL";
    }
  };

  const secretKey = extractSecretKey(qrCode!);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex h-full w-2/3 flex-col items-center justify-center space-y-6 p-4">
        <Button
          variant="link"
          size="lg"
          className="self-start text-primary"
          onClick={() => navigate(backButtonHref)}
        >
          <ChevronLeft />
          <span>Back</span>
        </Button>
        <div className="rounded-lg border-2 border-primary p-10">
          <h1 className="mb-4 text-2xl font-bold">Two-Factor Authentication</h1>

          <div className="flex flex-col items-center space-x-2">
            <Label htmlFor="2fa-toggle" className="mb-4 text-primary">
              Toggle to {is2FAEnabled ? "Disable" : "Enable"} Two-Factor
              Authentication
            </Label>
            <Switch
              id="2fa-toggle"
              checked={is2FAEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>

          {is2FAEnabled && recoveryCodes && (
            <Card>
              <CardHeader>
                <CardTitle>Recovery Codes</CardTitle>
                <CardDescription>
                  Save these recovery codes in a secure place. You can use these
                  to regain access to your account if you lose your 2FA device.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5">
                  {recoveryCodes.map((code, index) => (
                    <li key={index}>{code}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="flex flex-col">
            <DialogHeader>
              <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app or enter the secret
                key manually to enable 2FA.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center self-center py-4">
              <QRCode value={qrCode ? qrCode : ""} size={256} />

              {/* Secret Key Section */}
              <div className="mt-6 w-full max-w-sm">
                <Label htmlFor="secret-key" className="mb-2 block">
                  Secret Key
                </Label>
                <div className="flex items-center">
                  <Input
                    id="secret-key"
                    value={secretKey ? secretKey : ""}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="ml-2"
                  >
                    <Clipboard />
                  </Button>
                </div>
                {copySuccess && (
                  <span className="mt-1 text-sm text-green-500">
                    {copySuccess}
                  </span>
                )}
              </div>
            </div>
            <Label htmlFor="verification-code" className="mt-4">
              Verification Code
            </Label>
            <Input
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmEnable2FA}>Enable 2FA</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TwoFactorAuthUI;
