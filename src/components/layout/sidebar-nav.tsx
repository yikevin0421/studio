"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Star,
  Info,
  Settings,
  ShieldAlert,
  Flame,
  ArchiveX,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { name: "메인 화면", href: "/dashboard", icon: LayoutDashboard },
  { name: "커뮤니티", href: "/community", icon: Users },
  { name: "내가 쓴 글", href: "/my-posts", icon: MessageSquare },
  { name: "북마크", href: "/bookmarks", icon: Star },
  { name: "About", href: "/about", icon: Info },
];

const communitySubItems = [
  { name: "최근 뜨는 꿀팁", href: "/community?board=hot", icon: Flame, board: "hot" },
  { name: "유용한 꿀팁", href: "/community?board=useful", icon: Star, board: "useful" },
  { name: "과거의 꿀팁", href: "/community?board=past", icon: ArchiveX, board: "past" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const currentBoard = searchParams.get("board");
  const isCommunityOpen = pathname === "/community";

  const userRole = String(profile?.role ?? "").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>

              {item.name === "커뮤니티" && isCommunityOpen && (
                <div className="mt-1 space-y-1 pl-8">
                  {communitySubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = currentBoard === subItem.board;

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isSubActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <SubIcon className="h-4 w-4" />
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <ShieldAlert className="h-4 w-4" />
            관리자
          </Link>
        )}
      </nav>

      <nav className="space-y-1 border-t px-3 py-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/settings")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          설정
        </Link>
      </nav>
    </div>
  );
}
