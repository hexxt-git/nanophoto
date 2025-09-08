import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { HistoryIcon } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-4 justify-between px-4 pt-4 pb-2">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="size-12" />
        <h1 className="font-bold uppercase">NanoPhoto</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/history">
          <Button variant="ghost" size="icon">
            <HistoryIcon className="size-5" />
          </Button>
        </Link>
        <UserButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
