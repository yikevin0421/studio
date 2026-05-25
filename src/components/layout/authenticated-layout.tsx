"use client"

import { MainNav } from './main-nav';
import { SidebarNav } from './sidebar-nav';
import { BottomNav } from './bottom-nav';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
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