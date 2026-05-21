
"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldAlert, 
  Loader2, 
  Flag, 
  UserCog, 
  MessageSquare, 
  ArrowUpCircle, 
  ArrowDownCircle,
  EyeOff,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = profile?.role === 'superadmin';
  const isModerator = profile?.role === 'admin' || isSuperAdmin;

  useEffect(() => {
    if (!db || !isModerator) return;

    // Listen for all posts (moderators only)
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      setFlaggedPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for users (Superadmin only)
    let unsubscribeUsers = () => {};
    if (isSuperAdmin) {
      const usersQuery = query(collection(db, 'users'), orderBy('email'));
      unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    setLoading(false);
    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, [db, profile]);

  const handleRoleChange = async (userId: string, newRole: string, email: string) => {
    if (!db || !isSuperAdmin) return;
    
    if (!email.endsWith('@daegu.ac.kr')) {
      toast({ variant: "destructive", title: "Action Blocked", description: "Only university emails can hold staff roles." });
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast({ title: "Role Updated", description: `${email} is now a ${newRole}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update role." });
    }
  };

  if (!isModerator) {
    return (
      <AuthenticatedLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <ShieldAlert className="h-16 w-16 text-destructive opacity-20" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Only community moderators can access the Admin Console.</p>
          <Button asChild variant="outline"><Link href="/dashboard">Return to Safety</Link></Button>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
              <ShieldAlert className="h-8 w-8" />
              Moderation Console
            </h1>
            <p className="text-muted-foreground">Maintaining campus safety and respectful discourse.</p>
          </div>
          <Badge variant="outline" className="px-4 py-2 border-primary text-primary font-bold">
            {profile?.role?.toUpperCase()} ACCESS
          </Badge>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-8">
            <TabsTrigger value="content" className="gap-2"><Flag className="h-4 w-4" /> Content</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="users" className="gap-2"><UserCog className="h-4 w-4" /> User Mgmt</TabsTrigger>}
          </TabsList>

          <TabsContent value="content">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Global Content Feed</CardTitle>
                <CardDescription>Review all active and hidden posts across the campus square.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Snippet</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedPosts.map((post) => (
                      <TableRow key={post.id} className={post.hidden ? "bg-muted/30 opacity-60" : ""}>
                        <TableCell>
                          {post.hidden ? <Badge variant="secondary">Hidden</Badge> : <Badge className="bg-green-500">Active</Badge>}
                        </TableCell>
                        <TableCell className="font-medium">{post.username}</TableCell>
                        <TableCell className="max-w-[300px] truncate italic">"{post.content}"</TableCell>
                        <TableCell className="text-xs">
                          {post.timestamp ? formatDistanceToNow(post.timestamp.toDate()) : 'Recently'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" asChild>
                              <Link href={`/profile/${post.userId}`}><UserCog className="h-4 w-4" /></Link>
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="users">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>University Staff Management</CardTitle>
                  <CardDescription>Promote verified students to administrative roles. Only @daegu.ac.kr accounts allowed.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead className="text-right">Management</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'user' ? 'outline' : 'default'} className={cn(u.role === 'superadmin' && "bg-primary")}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {u.email !== SUPERADMIN_EMAIL && (
                              <div className="flex justify-end gap-2">
                                {u.role === 'user' ? (
                                  <Button size="sm" className="gap-1 h-8" onClick={() => handleRoleChange(u.id, 'admin', u.email)}>
                                    <ArrowUpCircle className="h-4 w-4" /> Promote to Admin
                                  </Button>
                                ) : u.role === 'admin' ? (
                                  <Button size="sm" variant="outline" className="gap-1 h-8 text-destructive" onClick={() => handleRoleChange(u.id, 'user', u.email)}>
                                    <ArrowDownCircle className="h-4 w-4" /> Demote to User
                                  </Button>
                                ) : null}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
