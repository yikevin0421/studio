"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TipEngagementActions } from "@/components/tip-engagement-actions";
import {
  MessageSquare,
  Pencil,
  MoreHorizontal,
  Trash2,
  Save,
  X,
} from "lucide-react";

type MyPost = {
  id: string;
  title: string;
  summary: string;
  category: string;
  tipCategory?: string;
  useful: number;
  bookmarks: number;
  verified?: number;
  createdAt: string;
  createdAtMs?: number;
  lastVerified?: string;
  status?: string;
  imageUrl?: string;
  authorName?: string;
  authorNumber?: number;
};

export default function MyPostsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingText, setEditingText] = useState("");
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);

  useEffect(() => {
    const posts = JSON.parse(
      localStorage.getItem("student-square-posts") ?? "[]"
    ) as MyPost[];

    if (posts.length > 0) {
      setMyPosts(posts);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setMyPosts([]);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const savePosts = (posts: MyPost[]) => {
    setMyPosts(posts);
    localStorage.setItem("student-square-posts", JSON.stringify(posts));
  };

  const handleEditStart = (post: MyPost) => {
    setEditingPostId(post.id);
    setEditingTitle(post.title);
    setEditingText(post.summary);
    setOpenMenuPostId(null);
  };

  const handleEditCancel = () => {
    setEditingPostId(null);
    setEditingTitle("");
    setEditingText("");
  };

  const handleEditSave = (postId: string) => {
    const trimmedTitle = editingTitle.trim();
    const trimmedText = editingText.trim();

    if (!trimmedTitle || !trimmedText) return;

    savePosts(
      myPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              title: trimmedTitle,
              summary: trimmedText,
              imageUrl: post.imageUrl,
            }
          : post
      )
    );

    setEditingPostId(null);
    setEditingTitle("");
    setEditingText("");
  };

  const handleDelete = (postId: string) => {
    const ok = confirm("이 글을 삭제할까요?");
    if (!ok) return;

    savePosts(myPosts.filter((post) => post.id !== postId));
    setOpenMenuPostId(null);
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquare className="h-7 w-7" />
              내가 쓴 글
            </h1>
            <p className="text-muted-foreground mt-2">
              내가 작성한 꿀팁 글을 확인할 수 있습니다.
            </p>
          </div>

          <Button asChild>
            <Link href="/write">
              <Pencil className="mr-2 h-4 w-4" />
              글 쓰기
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : myPosts.length > 0 ? (
          <div className="space-y-4">
            {myPosts.map((post) => {
              const isEditing = editingPostId === post.id;
              const isMenuOpen = openMenuPostId === post.id;

              return (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {post.tipCategory ?? post.category}
                          </Badge>
                          <Badge variant="outline">
                            {post.status ?? "방금 작성됨"}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {post.authorName ?? "꿀팁러 #0000"}
                        </p>

                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              value={editingTitle}
                              onChange={(event) => setEditingTitle(event.target.value)}
                              maxLength={80}
                              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
                            />

                            <textarea
                              value={editingText}
                              onChange={(event) => setEditingText(event.target.value)}
                              maxLength={1000}
                              className="min-h-[140px] w-full resize-none rounded-md border bg-background p-3 text-sm outline-none"
                            />

                            {post.imageUrl && (
                              <img
                                src={post.imageUrl}
                                alt="첨부 이미지"
                                className="max-h-[320px] w-full rounded-xl border object-cover"
                              />
                            )}
                          </div>
                        ) : (
                          <>
                            <CardTitle className="text-lg leading-relaxed">
                              {post.title}
                            </CardTitle>

                            <CardDescription className="leading-relaxed">
                              {post.summary}
                            </CardDescription>

                            {post.imageUrl && (
                              <img
                                src={post.imageUrl}
                                alt="첨부 이미지"
                                className="mt-3 max-h-[320px] w-full rounded-xl border object-cover"
                              />
                            )}
                          </>
                        )}
                      </div>

                      <div className="relative flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {post.createdAt}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setOpenMenuPostId(isMenuOpen ? null : post.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-9 z-20 w-36 rounded-md border bg-background p-1 shadow-md">
                            <button
                              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm "
                              onClick={() => handleEditStart(post)}
                            >
                              <Pencil className="h-4 w-4" />
                              수정하기
                            </button>

                            <button
                              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive "
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              삭제하기
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={handleEditCancel}>
                          <X className="mr-2 h-4 w-4" />
                          취소
                        </Button>

                        <Button size="sm" onClick={() => handleEditSave(post.id)}>
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    ) : (
                      <TipEngagementActions
                        postId={post.id}
                        title={post.title}
                        summary={post.summary}
                        category={post.tipCategory ?? post.category}
                        useful={post.useful}
                        bookmarks={post.bookmarks}
                        verified={post.verified ?? 0}
                        createdAt={post.createdAt}
                        createdAtMs={post.createdAtMs}
                        lastVerified={post.lastVerified ?? "-"}
                        status={post.status ?? "방금 작성됨"}
                        imageUrl={post.imageUrl}
                        authorName={post.authorName}
                        authorNumber={post.authorNumber}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-lg font-semibold">꿀팁을 공유해보세요!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                아직 작성한 글이 없습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
