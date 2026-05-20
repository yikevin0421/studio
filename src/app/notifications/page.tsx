"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, UserPlus, Bell } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'like', user: 'Kim Min-jun', content: 'liked your post about "Finals Study Group"', time: '2m ago' },
  { id: 2, type: 'comment', user: 'Park Ji-soo', content: 'commented: "I am interested! Where do we meet?"', time: '15m ago' },
  { id: 3, type: 'like', user: 'Lee Sang-hoon', content: 'liked your post about "Campus Food Review"', time: '1h ago' },
];

export default function NotificationsPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
        </div>

        <div className="space-y-4">
          {mockNotifications.map((notif) => (
            <Card key={notif.id} className="border-2 hover:border-primary/20 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 group-hover:border-primary/50 transition-colors">
                    <AvatarFallback>{notif.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -right-1 -bottom-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-background ${
                    notif.type === 'like' ? 'bg-red-500' : 'bg-primary'
                  }`}>
                    {notif.type === 'like' ? (
                      <Heart className="h-3 w-3 text-white fill-current" />
                    ) : (
                      <MessageSquare className="h-3 w-3 text-white fill-current" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold">{notif.user}</span> {notif.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}