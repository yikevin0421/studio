
"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { PostCard } from '@/components/community/post-card';
import { Loader2, Bookmark, Inbox } from 'lucide-react';

export default function BookmarksPage() {
  const { profile } = useAuth();
  const db = useFirestore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !profile) return;

    const bookmarksRef = collection(db, 'users', profile.uid, 'bookmarks');
    const q = query(bookmarksRef, orderBy('savedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const bookmarkIds = snapshot.docs.map(d => d.id);
      
      if (bookmarkIds.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Fetch actual post data for each bookmark
      const postPromises = bookmarkIds.map(id => getDoc(doc(db, 'posts', id)));
      const postSnapshots = await Promise.all(postPromises);
      
      const postsData = postSnapshots
        .filter(snap => snap.exists())
        .map(snap => ({ id: snap.id, ...snap.data() }));
        
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, profile]);

  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
            <Bookmark className="h-8 w-8" />
            Saved Posts
          </h1>
          <p className="text-muted-foreground">Keep track of discussions you find valuable.</p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            </div>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-32 bg-card border-2 border-dashed rounded-3xl space-y-4">
              <Inbox className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
              <div className="space-y-1">
                <p className="font-bold text-lg">No saved posts yet</p>
                <p className="text-muted-foreground">Bookmark interesting posts in the student square to see them here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
