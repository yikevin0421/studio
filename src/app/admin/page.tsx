
"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2, Flag, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const db = useFirestore();
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || profile?.role !== 'ADMIN') return;

    // In a real app, you'd query a specific 'reports' collection or use a 'flagged' boolean
    const q = query(
      collection(db, 'posts'),
      where('flagged', '==', true),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlaggedPosts(posts);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, profile]);

  if (profile?.role !== 'ADMIN') {
    return (
      <AuthenticatedLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <ShieldAlert className="h-16 w-16 text-destructive opacity-20" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Only community moderators can access the Admin Console.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Return to Safety</Link>
          </Button>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline text-destructive flex items-center gap-3">
            <ShieldAlert className="h-8 w-8" />
            Admin Moderation Console
          </h1>
          <p className="text-muted-foreground">Monitor campus safety and review flagged content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{flaggedPosts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires immediate review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">Campus guardians online</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Auto-moderated Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">28</div>
              <p className="text-xs text-muted-foreground mt-1">Posts blocked by AI</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 overflow-hidden">
          <CardHeader className="bg-card">
            <CardTitle className="flex items-center gap-2"><Flag className="h-5 w-5 text-destructive" /> Flagged Content Queue</CardTitle>
            <CardDescription>Review posts reported by students or flagged by the AI content moderator.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
              </div>
            ) : flaggedPosts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Content Snippet</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{post.username}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate italic text-muted-foreground">
                        "{post.content}"
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive text-[10px]">POTENTIAL HARASSMENT</Badge>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {post.timestamp ? formatDistanceToNow(post.timestamp.toDate()) : 'Recently'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/5" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" asChild title="View Original">
                            <Link href={`/profile/${post.userId}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-20 bg-secondary/10">
                <p className="text-muted-foreground italic">No content requires review at this time. Great job campus square!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
