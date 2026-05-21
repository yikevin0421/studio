"use client"

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Heart, Languages } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Home() {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const campusHero = PlaceHolderImages.find(img => img.id === 'hero-campus');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <span className="text-xl font-bold">D</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary font-headline">Daegu Pulse</span>
        </div>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'EN' : 'KO'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ko')}>한국어</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/about">{t('nav.about')}</Link>
          </Button>
          <Button asChild>
            <Link href={user ? "/dashboard" : "/login"}>
              {user ? (language === 'en' ? "Go to Dashboard" : "대시보드로 이동") : t('nav.login')}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border bg-background/50 backdrop-blur px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="mr-1">🎓</span>
                {t('home.badge')}
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-primary font-headline mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {language === 'en' ? (
                  <>Where Campus <span className="text-accent">Connects</span>.</>
                ) : (
                  <>캠퍼스가 <span className="text-accent">연결</span>되는 곳.</>
                )}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-900">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <Button size="lg" className="h-14 px-8 text-lg" asChild>
                  <Link href="/login">
                    {t('home.hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                  <Link href="/community">{t('home.hero.browse')}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 hidden lg:block pr-8 animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border aspect-[4/3] transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src={campusHero?.imageUrl} 
                alt={campusHero?.description}
                className="w-full h-full object-cover"
                data-ai-hint="university campus"
              />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 font-headline">Built for Student Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: language === 'en' ? "Student-Only Access" : "학생 전용 액세스", 
                  desc: language === 'en' ? "Restricted to @daegu.ac.kr email accounts for a trusted peer-to-peer environment." : "@daegu.ac.kr 이메일 계정으로 제한되어 신뢰할 수 있는 환경을 제공합니다.",
                  icon: ShieldCheck
                },
                { 
                  title: language === 'en' ? "Real-Time Interaction" : "실시간 상호작용", 
                  desc: language === 'en' ? "Get instant notifications when peers interact with your thoughts and posts." : "동료들이 내 글에 반응할 때 즉시 알림을 받으세요.",
                  icon: Zap
                },
                { 
                  title: language === 'en' ? "AI Moderation" : "AI 중재", 
                  desc: language === 'en' ? "A clean and respectful community maintained by intelligent content guardians." : "지능형 가디언이 관리하는 깨끗하고 존중하는 커뮤니티입니다.",
                  icon: Heart
                }
              ].map((feat, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                  <p className="text-muted-foreground">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground text-primary font-bold">D</div>
            <span className="text-xl font-bold font-headline">Daegu Pulse</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Daegu Pulse. {language === 'en' ? "Non-official student-led initiative." : "학생 주도 비공식 이니셔티브입니다."}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:underline text-sm opacity-60">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline text-sm opacity-60">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
