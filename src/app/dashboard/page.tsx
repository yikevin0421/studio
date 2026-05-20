"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Flame, 
  Star,
  PlusCircle,
  BookMarked
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { profile } = useAuth();

  const quickActions = [
    { label: 'Create Post', icon: PlusCircle, href: '/community', color: 'bg-blue-500' },
    { label: 'Bookmarks', icon: BookMarked, href: '/bookmarks', color: 'bg-purple-500' },
    { label: 'Join Clubs', icon: Users, href: '/community', color: 'bg-green-500' },
  ];

  return (
    <AuthenticatedLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary">
              Welcome back, {profile?.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening at Daegu University today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
              Verified Student
            </Badge>
            {profile?.role === 'ADMIN' && (
              <Badge className="bg-destructive hover:bg-destructive/90 px-3 py-1 text-sm rounded-full">
                Administrator
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last hour
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 new in your followed tags
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Trending</CardTitle>
              <Flame className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Campus Festival</div>
              <p className="text-xs text-muted-foreground mt-1">
                #festival #daegu_univ
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Popular in Student Square
                </CardTitle>
                <CardDescription>
                  Highly engaged discussions from fellow students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border hover:bg-accent transition-colors cursor-pointer group">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Best places to study for finals near campus?
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>User_{i}42</span>
                          <span>•</span>
                          <span>2 hours ago</span>
                          <span>•</span>
                          <span className="text-primary font-medium">{12 * i} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4" asChild>
                  <Link href="/community">View all discussions</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                {quickActions.map((action) => (
                  <Button key={action.label} variant="outline" className="h-12 justify-start gap-3 w-full" asChild>
                    <Link href={action.href}>
                      <action.icon className="h-5 w-5" />
                      {action.label}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="font-headline text-white">Campus Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 leading-relaxed">
                  The Library will have extended hours (24/7) starting next week for the examination period. Good luck to everyone!
                </p>
                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Read Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}