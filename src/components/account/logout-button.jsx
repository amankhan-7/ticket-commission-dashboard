"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LogoutButton = () => {
  const { logout: handleLogout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto w-full">
      <Button
        onClick={handleLogout}
        className="w-full py-4 flex items-center justify-center gap-3
        rounded-xl font-semibold text-white shadow-lg
        transition-all hover:opacity-90"
        style={{ background: "#c0392b" }} // High-contrast red
      >
        <LogOut className="w-5 h-5 text-white" />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
