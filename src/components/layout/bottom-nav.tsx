"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  User,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const items = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Feed', href: '/community', icon: Users },
    { name: 'Post', href: '/community?create=true', icon: PlusCircle },
    { name: 'Alerts', href: '/notifications', icon: Bell },
    { name: 'Profile', href: profile ? `/profile/${profile.uid}` : '/login', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t bg-background lg:hidden">
      <div className="grid h-full grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", item.name === 'Post' && "text-primary")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}