
"use client"

import { useParams } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useDoc, useFirestore } from '@/firebase';
import { doc, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostCard } from '@/components/community/post-card';
import { Loader2, Calendar, Mail, FileText, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { uid } = useParams();
  const db = useFirestore();
  const { data: userProfile, loading: profileLoading } = useDoc<any>(
    uid ? doc(db!, 'users', uid as string) : null
  );
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!db || !uid) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [db, uid]);

  if (profileLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <Card className="overflow-hidden border-2">
          <div className="h-32 bg-primary/10 w-full" />
          <CardContent className="relative pt-0 px-6 pb-6">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={userProfile?.photoURL} />
                <AvatarFallback className="text-2xl font-bold">{userProfile?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold font-headline">{userProfile?.displayName}</h1>
                  <Badge variant="secondary">{userProfile?.role || 'STUDENT'}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {userProfile?.email}</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> 
                    Joined {userProfile?.createdAt ? format(userProfile.createdAt.toDate(), 'MMMM yyyy') : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary" /> Student Bio</h3>
              <p className="text-muted-foreground leading-relaxed italic">
                {userProfile?.bio || "This student hasn't shared a bio yet. Busy studying at Daegu University!"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Activity
          </h2>
          <div className="grid gap-6">
            {postsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary opacity-20" />
              </div>
            ) : userPosts.length > 0 ? (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-muted">
                <p className="text-muted-foreground italic">No public activity found for this student.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
