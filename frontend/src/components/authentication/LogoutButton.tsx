import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { logoutUser } from "@/services/auth/logout.ts";
import useStatus from "@/hooks/useStatus.tsx";
import { toast } from "@/hooks/use-toast";
import useTimer from "@/hooks/useTimer.tsx";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";

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
    setLoading(); // If useStatus manages loading
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
        setDone();
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
    <>
      {/* Backdrop */}
      {status === "loading" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          aria-live="assertive"
          aria-busy="true"
        >
          <div className="flex flex-col items-center justify-center space-y-4 rounded bg-white p-6 shadow-lg dark:bg-zinc-800">
            <LoadingSpinner size={48} className="text-primary" />{" "}
            {/* Use LoadingSpinner */}
            <p className="text-lg font-medium text-primary">Logging out...</p>
          </div>
        </div>
      )}
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
    </>
  );
}

export default LogoutButton;
