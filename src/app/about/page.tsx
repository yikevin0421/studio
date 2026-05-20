"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const libraryImg = PlaceHolderImages.find(img => img.id === 'student-life');

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="container mx-auto px-4 h-20 flex items-center">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </header>

      <main className="container mx-auto px-4 max-w-4xl pt-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold font-headline text-primary">About Daegu Pulse</h1>
          <p className="text-xl text-muted-foreground">The heartbeat of Daegu University student life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Daegu Pulse was created to solve a simple problem: the lack of a secure, verified, and modern space for university students to share information and build community without the noise of public social media.
            </p>
            <ul className="space-y-4">
              {[
                "Privacy-first student verification",
                "AI-powered respectful environment",
                "Real-time campus updates",
                "Peer-to-peer support network"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={libraryImg?.imageUrl} 
              alt="Students studying" 
              className="w-full h-full object-cover"
              data-ai-hint="students studying"
            />
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-10 border border-primary/10 text-center">
          <h3 className="text-2xl font-bold mb-4">Are you a Daegu Student?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of your peers today. All you need is your official university email to get started.
          </p>
          <Button size="lg" className="rounded-full px-10" asChild>
            <Link href="/login">Get Started Now</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}