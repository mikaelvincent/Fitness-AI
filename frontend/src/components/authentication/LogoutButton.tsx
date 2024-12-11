import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const handleLogout = () => {
    // Add logout logic here
  };
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-lg hover:bg-secondary hover:text-primary"
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
