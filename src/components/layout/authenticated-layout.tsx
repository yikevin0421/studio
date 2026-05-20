"use client"

import { useAuth } from '@/hooks/use-auth';
import { MainNav } from './main-nav';
import { SidebarNav } from './sidebar-nav';
import { BottomNav } from './bottom-nav';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground animate-pulse">
          <span className="text-3xl font-bold">D</span>
        </div>
        <div className="flex items-center gap-2 text-primary font-medium">
          <Loader2 className="h-5 w-5 animate-spin" />
          Syncing Campus Data...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 lg:flex container mx-auto px-0 lg:px-4">
        <SidebarNav />
        <main className="flex-1 p-4 pb-24 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}