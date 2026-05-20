"use client"

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Heart, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const { user } = useAuth();
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
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button asChild>
            <Link href={user ? "/dashboard" : "/login"}>
              {user ? "Go to Dashboard" : "Student Login"}
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
                Exclusively for Daegu University Students
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-primary font-headline mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                Where Campus <span className="text-accent">Connects</span>.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-900">
                Join the official digital square for verified students. Share ideas, get campus news, and build lasting friendships in a safe, AI-moderated environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <Button size="lg" className="h-14 px-8 text-lg" asChild>
                  <Link href="/login">
                    Join the Community <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                  <Link href="/community">Browse Feed</Link>
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
                  title: "Student-Only Access", 
                  desc: "Restricted to @daegu.ac.kr email accounts for a trusted peer-to-peer environment.",
                  icon: ShieldCheck
                },
                { 
                  title: "Real-Time Interaction", 
                  desc: "Get instant notifications when peers interact with your thoughts and posts.",
                  icon: Zap
                },
                { 
                  title: "AI Moderation", 
                  desc: "A clean and respectful community maintained by intelligent content guardians.",
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
            © 2024 Daegu Pulse. Non-official student-led initiative.
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