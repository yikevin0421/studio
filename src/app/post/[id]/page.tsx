
"use client"

import { useParams, useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, serverTimestamp, addDoc, increment, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { PostCard } from '@/components/community/post-card';
import { Loader2, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postRef = id ? doc(db!, 'posts', id as string) : null;
  const { data: post, loading: postLoading } = useDoc<any>(postRef);

  const commentsQuery = id 
    ? query(collection(db!, 'posts', id as string, 'comments'), orderBy('timestamp', 'asc'))
    : null;
  const { data: comments, loading: commentsLoading } = useCollection<any>(commentsQuery);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !profile || !db || !id) return;

    setIsSubmitting(true);
    const commentsRef = collection(db, 'posts', id as string, 'comments');
    const commentData = {
      userId: profile.uid,
      username: profile.displayName,
      content: commentContent,
      timestamp: serverTimestamp(),
      hidden: false,
    };

    addDoc(commentsRef, commentData)
      .then(() => {
        updateDoc(doc(db, 'posts', id as string), {
          commentCount: increment(1)
        }).catch(() => {});
        
        setCommentContent('');
        toast({ title: "Comment added!" });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: commentsRef.path,
          operation: 'create',
          requestResourceData: commentData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setIsSubmitting(false));
  };

  if (postLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!post) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-20 space-y-4">
          <p className="text-xl font-bold">Post not found</p>
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Feed
        </Button>

        <PostCard post={post} />

        <Card className="border-2">
          <CardHeader className="border-b bg-primary/5">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <form onSubmit={handleAddComment} className="flex gap-4 items-start">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea 
                  placeholder="Write a supportive comment..." 
                  className="min-h-[80px] resize-none border-2"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button disabled={!commentContent.trim() || isSubmitting} size="sm" className="gap-2">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Reply
                  </Button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {commentsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary opacity-20" />
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{comment.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-secondary/30 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{comment.username}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {comment.timestamp?.toDate ? formatDistanceToNow(comment.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground italic">No comments yet. Be the first to start the conversation!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
