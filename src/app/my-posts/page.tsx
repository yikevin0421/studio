
"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { PostCard } from '@/components/community/post-card';
import { Loader2, MessageSquare, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyPostsPage() {
  const { profile } = useAuth();
  const db = useFirestore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !profile) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', profile.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, profile]);

  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
              <MessageSquare className="h-8 w-8" />
              My Contributions
            </h1>
            <p className="text-muted-foreground">Manage the thoughts you've shared with the campus.</p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/community">
              <PenTool className="h-4 w-4 mr-2" /> New Post
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            </div>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-32 bg-card border-2 border-dashed rounded-3xl space-y-6">
              <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-10 w-10 text-primary opacity-30" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-xl">You haven't posted yet</p>
                <p className="text-muted-foreground max-w-xs mx-auto">Share your first thought or question with fellow students in the Student Square!</p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/community">Start a Conversation</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
