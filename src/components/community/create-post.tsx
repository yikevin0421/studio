
"use client"

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ImagePlus, Send, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiContentModeration } from '@/ai/flows/ai-content-moderation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
  const { profile } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationResult, setModerationResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !profile || !db) return;

    setIsSubmitting(true);
    setModerationResult(null);

    try {
      // AI Content Moderation
      const mod = await aiContentModeration({ content });
      
      if (mod.isFlagged) {
        setModerationResult(mod);
        toast({
          variant: "destructive",
          title: "Content Flagged",
          description: "Your post contains content that violates our community guidelines."
        });
        setIsSubmitting(false);
        return;
      }

      // If clean, create post
      addDoc(collection(db, 'posts'), {
        userId: profile.uid,
        username: profile.displayName,
        email: profile.email,
        profilePicture: profile.photoURL,
        content: content,
        timestamp: serverTimestamp(),
        category: 'General',
        likesCount: 0,
        dislikesCount: 0,
        commentCount: 0,
        isEdited: false,
        flagged: false,
      });

      setContent('');
      toast({
        title: "Post Published!",
        description: "Your post is now live in the student community."
      });
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Error creating post", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md border-2 overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b bg-primary/5">
        <h3 className="font-bold text-lg font-headline flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          What's on your mind?
        </h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder={`Hi ${profile?.displayName?.split(' ')[0]}, share something with fellow students...`}
            className="min-h-[120px] text-lg border-none focus-visible:ring-0 resize-none p-0 bg-transparent placeholder:text-muted-foreground/60"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {moderationResult?.isFlagged && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Content Review Required</AlertTitle>
              <AlertDescription>
                {moderationResult.moderationExplanation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t bg-secondary/20 p-4">
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" className="rounded-full text-muted-foreground">
              <ImagePlus className="h-4 w-4 mr-2" />
              Image
            </Button>
            <div className="flex items-center text-xs text-muted-foreground px-2">
              {content.length}/1000
            </div>
          </div>
          <Button 
            type="submit"
            disabled={!content.trim() || isSubmitting} 
            className="rounded-full px-6 shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
