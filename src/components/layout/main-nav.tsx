"use client"

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, User, Settings, ShieldCheck, Languages } from 'lucide-react';

export function MainNav() {
  const { profile, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-xl font-bold">D</span>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-primary sm:inline-block font-headline">
              Daegu Pulse
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'KO'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                {t('lang.en')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ko')} className={language === 'ko' ? 'bg-accent' : ''}>
                {t('lang.ko')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>

          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                    <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${profile.uid}`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {String(profile.role).toLowerCase() === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Console</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
