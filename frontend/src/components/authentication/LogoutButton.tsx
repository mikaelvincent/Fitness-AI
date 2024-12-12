import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { logoutUser } from "@/services/auth/logout.ts";
import useStatus from "@/hooks/useStatus.tsx";
import { toast } from "@/hooks/use-toast";
import useTimer from "@/hooks/useTimer.tsx";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { token, logoutUser: contextLogoutUser } = useUser();
  const { status, setLoading, setDone, setError } = useStatus();
  const navigate = useNavigate();

  const {
    timeLeft: cooldown,
    start: startCooldown,
    reset: resetCooldown,
  } = useTimer(
    0,
    () => {
      setDone();
    },
    "logoutRetryTimer",
  );

  const handleLogout = async () => {
    try {
      const response = await logoutUser(token);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      if (!response?.success) {
        setError();
        toast({
          title: "Success",
          description:
            response?.message || response.status === 429
              ? "Too many attempts. Please try again later."
              : "Logout failed. Please Try again",
        });
        startCooldown(response?.retry_after || 0);
        return;
      }
      if (response?.success) {
        contextLogoutUser();
        toast({
          title: "Success",
          description: response?.message || "Logout successful",
        });
        navigate("/login");
        return;
      }
    } catch (error) {
      setError();
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };
  return (
    <Button
      variant="ghost"
      className="w-full justify-start py-10 text-lg hover:bg-secondary hover:text-primary"
      onClick={handleLogout}
    >
      <div className="mr-4 rounded-full bg-primary p-2">
        <LogOut className="h-5 w-5" />
      </div>
      Logout
    </Button>
  );
}

export default LogoutButton;
