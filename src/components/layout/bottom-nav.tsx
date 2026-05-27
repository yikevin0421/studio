"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Pencil, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const navItems = [
    {
      name: "메인",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "커뮤니티",
      href: "/community",
      icon: Users,
    },
    {
      name: "글 쓰기",
      href: "/write",
      icon: Pencil,
    },
    {
      name: "북마크",
      href: "/bookmarks",
      icon: Star,
    },
    {
      name: "프로필",
      href: profile?.uid ? `/profile/${profile.uid}` : "/login",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground "
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
