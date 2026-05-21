
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
  Share2, 
  MoreVertical, 
  Flag, 
  Trash2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function PostCard({ post }: { post: any }) {
  const { profile } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  useEffect(() => {
    if (!profile || !db || !post.id) return;
    
    // Check if saved
    const checkSaved = async () => {
      const bookmarkRef = doc(db, 'users', profile.uid, 'bookmarks', post.id);
      const snapshot = await getDoc(bookmarkRef);
      if (snapshot.exists()) setIsSaved(true);
    };
    checkSaved();
  }, [profile, db, post.id]);

  const handleLike = async () => {
    if (!profile || !db) {
      toast({ title: "Please login first", variant: "destructive" });
      return;
    }
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      const postRef = doc(db, 'posts', post.id);
      updateDoc(postRef, {
        likesCount: increment(newLikedState ? 1 : -1)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!profile || !db) return;
    
    const bookmarkRef = doc(db, 'users', profile.uid, 'bookmarks', post.id);
    
    try {
      if (isSaved) {
        await deleteDoc(bookmarkRef);
        setIsSaved(false);
        toast({ title: "Post removed from bookmarks" });
      } else {
        await setDoc(bookmarkRef, {
          postId: post.id,
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
        toast({ title: "Post saved to bookmarks" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!profile || !db) return;
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      toast({ title: "Post Deleted" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReport = () => {
    toast({ title: "Report received", description: "Our moderators will review this content." });
  };

  return (
    <Card className="shadow-sm border-2 hover:border-primary/20 transition-all bg-card">
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
            {post.role === 'ADMIN' && (
              <Badge className="h-5 px-1 bg-destructive text-[10px] rounded-sm">ADMIN</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {post.timestamp?.toDate ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'just now'}
            </span>
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
              <Link href={`/profile/${post.userId}`}>
                <ExternalLink className="h-4 w-4" /> View Profile
              </Link>
            </DropdownMenuItem>
            {profile?.uid === post.userId && (
              <DropdownMenuItem onClick={handleDelete} className="text-destructive gap-2">
                <Trash2 className="h-4 w-4" /> Delete Post
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleReport} className="text-destructive gap-2">
              <Flag className="h-4 w-4" /> Report
            </DropdownMenuItem>
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
          <Button variant="ghost" size="sm" className="gap-2 rounded-full text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-semibold">{post.commentCount || 0}</span>
          </Button>
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
