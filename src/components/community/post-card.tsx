
"use client"

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, increment, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Heart, 
  MessageCircle, 
  MoreVertical, 
  Trash2,
  Bookmark,
  ExternalLink,
  EyeOff,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function PostCard({ post }: { post: any }) {
  const { profile } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const isModerator = profile?.role === 'admin' || profile?.role === 'superadmin';

  useEffect(() => {
    if (!profile || !db || !post.id) return;
    
    const checkSaved = async () => {
      const bookmarkRef = doc(db, 'users', profile.uid, 'bookmarks', post.id);
      const snapshot = await getDoc(bookmarkRef);
      if (snapshot.exists()) setIsSaved(true);
    };
    checkSaved();
  }, [profile, db, post.id]);

  const handleLike = () => {
    if (!profile || !db) {
      toast({ title: "Please login first", variant: "destructive" });
      return;
    }
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    const postRef = doc(db, 'posts', post.id);
    updateDoc(postRef, {
      likesCount: increment(newLikedState ? 1 : -1)
    }).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: postRef.path,
        operation: 'update',
        requestResourceData: { likesCount: 'increment' },
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const handleSave = () => {
    if (!profile || !db) return;
    const bookmarkRef = doc(db, 'users', profile.uid, 'bookmarks', post.id);
    
    if (isSaved) {
      deleteDoc(bookmarkRef).then(() => {
        setIsSaved(false);
        toast({ title: "Post removed from bookmarks" });
      }).catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: bookmarkRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    } else {
      const data = {
        postId: post.id,
        savedAt: new Date().toISOString()
      };
      setDoc(bookmarkRef, data).then(() => {
        setIsSaved(true);
        toast({ title: "Post saved to bookmarks" });
      }).catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: bookmarkRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    }
  };

  const handleDelete = () => {
    if (!db || !post.id) return;
    const postRef = doc(db, 'posts', post.id);
    deleteDoc(postRef).then(() => {
      toast({ title: "Post Deleted" });
    }).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: postRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const toggleHide = () => {
    if (!db || !post.id) return;
    const postRef = doc(db, 'posts', post.id);
    const hiddenState = !post.hidden;
    updateDoc(postRef, {
      hidden: hiddenState
    }).then(() => {
      toast({ title: hiddenState ? "Post Hidden" : "Post Restored" });
    }).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: postRef.path,
        operation: 'update',
        requestResourceData: { hidden: hiddenState },
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <Card className={cn("shadow-sm border-2 transition-all bg-card", post.hidden && "opacity-60 grayscale bg-muted/30")}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
        <Link href={`/profile/${post.userId}`}>
          <Avatar className="h-10 w-10 hover:opacity-80 transition-opacity">
            <AvatarImage src={post.profilePicture} alt={post.username} />
            <AvatarFallback>{post.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.userId}`} className="font-bold text-primary hover:underline">
              {post.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {post.timestamp?.toDate ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'just now'}
            </span>
            {post.hidden && <Badge variant="secondary" className="text-[10px] h-4">HIDDEN</Badge>}
          </div>
          <Badge variant="outline" className="w-fit h-5 text-[10px] mt-0.5 px-1 font-normal opacity-70">
            {post.category || 'General'}
          </Badge>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSave} className="gap-2">
              <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} /> 
              {isSaved ? 'Unsave Post' : 'Save Post'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2">
              <Link href={`/post/${post.id}`}>
                <ExternalLink className="h-4 w-4" /> View Full Post
              </Link>
            </DropdownMenuItem>
            {(profile?.uid === post.userId || isModerator) && (
              <DropdownMenuItem onClick={handleDelete} className="text-destructive gap-2">
                <Trash2 className="h-4 w-4" /> Delete Post
              </DropdownMenuItem>
            )}
            {isModerator && (
              <DropdownMenuItem onClick={toggleHide} className="gap-2">
                {post.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {post.hidden ? 'Restore Post' : 'Hide Post'}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
          {post.content}
        </p>
        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden border">
            <img src={post.image} alt="Post media" className="w-full h-auto object-cover max-h-[400px]" />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 px-4 border-t flex items-center justify-between">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("gap-2 rounded-full", isLiked && "text-destructive bg-destructive/10 hover:bg-destructive/20")} 
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-xs font-semibold">{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 rounded-full text-muted-foreground" asChild>
            <Link href={`/post/${post.id}`}>
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-semibold">{post.commentCount || 0}</span>
            </Link>
          </Button>
          
          {isModerator && (
            <div className="flex ml-4 pl-4 border-l gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10 h-8 px-2"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> <span className="text-[10px] font-bold">REMOVE</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:bg-secondary h-8 px-2"
                onClick={toggleHide}
              >
                {post.hidden ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                <span className="text-[10px] font-bold uppercase">{post.hidden ? 'RESTORE' : 'HIDE'}</span>
              </Button>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("rounded-full", isSaved ? "text-primary bg-primary/10" : "text-muted-foreground")}
          onClick={handleSave}
        >
          <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
        </Button>
      </CardFooter>
    </Card>
  );
}
