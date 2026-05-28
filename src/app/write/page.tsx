"use client"

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImagePlus, Pencil, Send, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useFirestore } from "@/firebase";
import { getOrCreateTipsterProfile } from "@/lib/tipster-profile";

type StoredPost = {
  id: string;
  title: string;
  summary: string;
  category: "최근 뜨는 꿀팁";
  tipCategory: string;
  useful: number;
  bookmarks: number;
  verified: number;
  createdAt: string;
  createdAtMs: number;
  lastVerified: string;
  status: string;
  imageUrl?: string;
  authorName: string;
  authorNumber: number;
  userId?: string;
  hidden?: boolean;
};

const tipCategories = [
  "학교생활",
  "공부공간",
  "장학/근로",
  "수강신청",
  "시설/편의",
  "기타",
];

export default function WritePage() {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useAuth();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [tipCategory, setTipCategory] = useState("학교생활");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isKorean = language === "ko";

  const handleImageSelect = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent || isSubmitting) return;

    setIsSubmitting(true);

    const now = new Date();
    const tipsterProfile = getOrCreateTipsterProfile();
    const fallbackPostId = `post-${Date.now()}`;

    let postId = fallbackPostId;

    const newPost: StoredPost = {
      id: postId,
      title: trimmedTitle,
      summary: trimmedContent,
      category: "최근 뜨는 꿀팁",
      tipCategory,
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
      imageUrl,
      authorName: tipsterProfile.authorName,
      authorNumber: tipsterProfile.authorNumber,
      userId: user?.uid,
      hidden: false,
    };

    try {
      if (db) {
        const postRef = doc(collection(db, "posts"));
        postId = postRef.id;
        newPost.id = postId;

        const writerId = user?.uid ?? `demo-tipster-${tipsterProfile.authorNumber}`;
        const writerEmail = user?.email ?? "demo-login-mode";

        await Promise.race([
          setDoc(postRef, {
            id: postRef.id,
            title: trimmedTitle,
            summary: trimmedContent,
            content: trimmedContent,
            detail: trimmedContent,
            category: "최근 뜨는 꿀팁",
            tipCategory,
            useful: 0,
            bookmarks: 0,
            verified: 0,
            createdAt: serverTimestamp(),
            createdAtMs: now.getTime(),
            lastVerified: now.toLocaleDateString("ko-KR"),
            status: "방금 작성됨",
            imageUrl: imageUrl ?? null,
            authorName: tipsterProfile.authorName,
            authorNumber: tipsterProfile.authorNumber,
            author: tipsterProfile.authorName,
            userName: tipsterProfile.authorName,
            userId: writerId,
            email: writerEmail,
            hidden: false,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firebase 저장 시간이 초과되었습니다.")), 5000)
          ),
        ]);
      } else {
        console.warn("Firebase db가 없어 localStorage에만 저장합니다.");
      }
    } catch (error) {
      console.error("Firebase 저장 실패:", error);
      alert("Firebase 저장은 실패했지만, 브라우저에는 임시 저장됩니다. 콘솔 오류를 확인해주세요.");
    } finally {
      const savedPosts = JSON.parse(
        localStorage.getItem("student-square-posts") ?? "[]"
      ) as StoredPost[];

      localStorage.setItem(
        "student-square-posts",
        JSON.stringify([newPost, ...savedPosts])
      );

      setTitle("");
      setTipCategory("학교생활");
      setContent("");
      setImageUrl(undefined);
      setIsSubmitting(false);
      router.push("/community");
    }
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

          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">제목</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={80}
                placeholder="제목을 입력하세요"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/80
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">카테고리</label>
              <select
                value={tipCategory}
                onChange={(event) => setTipCategory(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              >
                {tipCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">내용</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={1000}
                placeholder="예: 도서관 자리, 장학금 신청, 학식, 프린트, 수강신청 관련 꿀팁을 작성해보세요..."
                className="min-h-[260px] w-full resize-none rounded-md border border-input bg-background p-4 text-sm outline-none placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length}/1000
              </p>
            </div>

            {imageUrl && (
              <div className="relative overflow-hidden rounded-xl border">
                <img
                  src={imageUrl}
                  alt="첨부 이미지 미리보기"
                  className="max-h-[320px] w-full object-cover"
                />

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-3"
                  onClick={() => setImageUrl(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageSelect(event.target.files?.[0])}
              />

              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {isKorean ? "이미지" : "Image"}
              </Button>

              <Button
                disabled={!title.trim() || !content.trim() || isSubmitting}
                onClick={handleSubmit}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "게시 중..." : isKorean ? "게시하기" : "Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
