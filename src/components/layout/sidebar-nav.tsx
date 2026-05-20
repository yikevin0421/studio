"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bookmark,
  Info,
  Bell,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'My Posts', href: '/my-posts', icon: MessageSquare },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'About', href: '/about', icon: Info },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <div className="hidden h-[calc(100vh-4rem)] w-64 border-r bg-card/50 lg:flex lg:flex-col">
      <div className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        
        {profile?.role === 'ADMIN' && (
          <div className="pt-4 mt-4 border-t">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Moderation
            </p>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-destructive/10 hover:text-destructive",
                pathname === '/admin' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "text-muted-foreground"
              )}
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent text-muted-foreground hover:text-accent-foreground",
            pathname === '/settings' && "bg-accent text-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}