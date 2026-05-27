"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImagePlus, Pencil, Send } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type StoredPost = {
  id: string;
  title: string;
  summary: string;
  category: "최근 뜨는 꿀팁";
  useful: number;
  bookmarks: number;
  verified: number;
  createdAt: string;
  createdAtMs: number;
  lastVerified: string;
  status: string;
};

export default function WritePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [content, setContent] = useState("");

  const isKorean = language === "ko";

  const handleSubmit = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    const now = new Date();

    const newPost: StoredPost = {
      id: `post-${Date.now()}`,
      title:
        trimmedContent.length > 40
          ? `${trimmedContent.slice(0, 40)}...`
          : trimmedContent,
      summary: trimmedContent,
      category: "최근 뜨는 꿀팁",
      useful: 0,
      bookmarks: 0,
      verified: 0,
      createdAt: now.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAtMs: now.getTime(),
      lastVerified: now.toLocaleDateString("ko-KR"),
      status: "방금 작성됨",
    };

    const savedPosts = JSON.parse(
      localStorage.getItem("student-square-posts") ?? "[]"
    ) as StoredPost[];

    localStorage.setItem(
      "student-square-posts",
      JSON.stringify([newPost, ...savedPosts])
    );

    setContent("");
    router.push("/community");
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              메인 화면으로 돌아가기
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Pencil className="h-7 w-7" />
            글 쓰기
          </h1>

          <p className="text-muted-foreground mt-2">
            학교생활 꿀팁을 작성해서 학생들과 공유할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              어떤 꿀팁을 공유할까요?
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={1000}
              placeholder="예: 도서관 자리, 장학금 신청, 학식, 프린트, 수강신청 관련 꿀팁을 작성해보세요..."
              className="min-h-[260px] w-full resize-none border-0 bg-background p-6 text-sm outline-none placeholder:text-muted-foreground"
            />

            <div className="flex items-center justify-between border-t p-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" type="button">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {isKorean ? "이미지" : "Image"}
                </Button>

                <span className="text-sm text-muted-foreground">
                  {content.length}/1000
                </span>
              </div>

              <Button disabled={!content.trim()} onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                {isKorean ? "게시하기" : "Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
