"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-0">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <span className="text-3xl font-bold">D</span>
          </div>
        </div>

        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold font-headline">Student Portal</CardTitle>
            <CardDescription className="text-lg">
              Sign in with your university account to join the community.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-primary/80 leading-relaxed">
                  Only <strong>@daegu.ac.kr</strong> email addresses are permitted. All content is AI-moderated for safety.
                </p>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full h-14 text-lg font-semibold gap-3"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-6 h-6 bg-white rounded-full p-0.5"
              />
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 text-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center uppercase tracking-widest">
              <Mail className="h-3 w-3" />
              Demo Login Mode
            </div>
            <p className="text-xs text-muted-foreground px-4">
              This button currently redirects to the dashboard for local demo testing.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}