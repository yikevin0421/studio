"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="text-lg font-bold text-primary">
          Daegu Pulse
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
