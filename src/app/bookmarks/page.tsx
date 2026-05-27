"use client"

import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TipEngagementActions } from "@/components/tip-engagement-actions";
import { Star } from "lucide-react";

type BookmarkPost = {
  id: string;
  title: string;
  summary: string;
  category?: string;
  useful: number;
  bookmarks: number;
  verified: number;
  createdAt?: string;
  createdAtMs?: number;
  lastVerified?: string;
  status?: string;
};

export default function BookmarksPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkPost[]>([]);

  useEffect(() => {
    const posts = JSON.parse(
      localStorage.getItem("student-square-bookmarks") ?? "[]"
    ) as BookmarkPost[];

    setBookmarkedPosts(posts);
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Star className="h-7 w-7" />
            북마크
          </h1>

          <p className="text-muted-foreground mt-2">
            내가 북마크한 꿀팁을 확인할 수 있습니다.
          </p>
        </div>

        {bookmarkedPosts.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="space-y-2">
                    {post.category && <Badge variant="secondary">{post.category}</Badge>}

                    <CardTitle className="text-lg leading-relaxed">
                      {post.title}
                    </CardTitle>

                    <CardDescription className="leading-relaxed">
                      {post.summary}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  <TipEngagementActions
                    postId={post.id}
                    title={post.title}
                    summary={post.summary}
                    category={post.category}
                    useful={post.useful}
                    bookmarks={post.bookmarks}
                    verified={post.verified}
                    createdAt={post.createdAt}
                    createdAtMs={post.createdAtMs}
                    lastVerified={post.lastVerified ?? "-"}
                    status={post.status ?? "현재 유효"}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-lg font-semibold">북마크한 꿀팁이 없습니다.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                유용한 꿀팁을 북마크하면 이곳에서 다시 볼 수 있습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
