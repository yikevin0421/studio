"use client"

import { useEffect, useMemo, useState } from "react";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TipActionMenu } from "@/components/tip-action-menu";
import { TipEngagementActions } from "@/components/tip-engagement-actions";
import {
  BookMarked,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from "lucide-react";

type PopularTip = {
  id: string;
  title: string;
  summary: string;
  detail?: string;
  category: string;
  tipCategory?: string;
  useful: number;
  bookmarks: number;
  verified: number;
  createdAt?: string;
  createdAtMs?: number;
  lastVerified?: string;
  status?: string;
  imageUrl?: string;
  authorName?: string;
  authorNumber?: number;
  isMine?: boolean;
};

type EngagementCounts = {
  useful: number;
  bookmarks: number;
  verified: number;
};

const sampleTips: PopularTip[] = [
  {
    id: "popular-001",
    title: "사범대 라운지에 전자레인지와 뜨거운 물 나오는 공간이 있습니다",
    summary: "공강 시간이나 시험기간에 도시락이나 컵라면을 먹기 좋은 공간입니다.",
    detail: "사범대 라운지에는 전자레인지와 뜨거운 물을 이용할 수 있는 공간이 있어 시험기간이나 공강 시간에 간단히 식사하기 좋습니다. 다만 학교 시설은 변경될 수 있으므로 최근 검증일과 학생들의 검증 수를 함께 확인하는 것이 좋습니다.",
    category: "학교생활",
    useful: 128,
    bookmarks: 86,
    verified: 32,
    createdAt: "2026.05.27 14:20",
    createdAtMs: 1779862800000,
    lastVerified: "2026.05.26",
    status: "현재 유효",
    authorName: "꿀팁러 #1001",
    authorNumber: 1001,
    isMine: false,
  },
  {
    id: "popular-002",
    title: "국가근로 신청 전 희망근로지 모집 여부를 먼저 확인하면 시간을 줄일 수 있습니다",
    summary: "희망근로지 모집 여부와 선발 조건을 먼저 확인하면 불필요한 지원을 줄일 수 있습니다.",
    detail: "국가근로는 신청 자체도 중요하지만 실제 희망근로지가 모집 중인지, 본인의 시간표와 근로 시간이 맞는지도 중요합니다. 신청 전에 모집 여부를 확인하면 불필요한 지원을 줄일 수 있습니다.",
    category: "장학/근로",
    useful: 187,
    bookmarks: 65,
    verified: 39,
    createdAt: "2026.05.26 18:10",
    createdAtMs: 1779786600000,
    lastVerified: "2026.04.15",
    status: "최근 검증됨",
    authorName: "꿀팁러 #1005",
    authorNumber: 1005,
    isMine: false,
  },
  {
    id: "popular-003",
    title: "타대학 K-MOOC 원격강좌 학점인정은 매 학기 공지를 다시 확인해야 합니다",
    summary: "K-MOOC 학점인정은 매 학기 신청 기간과 인정 기준이 달라질 수 있습니다.",
    detail: "타대학 K-MOOC 원격강좌 학점인정은 한 번 올라온 정보가 계속 동일하게 적용되는 것이 아니라 매 학기 신청 기간, 인정 기준, 제출 서류가 달라질 수 있습니다.",
    category: "학점인정",
    useful: 214,
    bookmarks: 59,
    verified: 45,
    createdAt: "2026.05.25 10:00",
    createdAtMs: 1779663600000,
    lastVerified: "2026.03.04",
    status: "갱신형 정보",
    authorName: "꿀팁러 #1004",
    authorNumber: 1004,
    isMine: false,
  },
];

export default function PopularBookmarksPage() {
  const [storedPosts, setStoredPosts] = useState<PopularTip[]>([]);
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingText, setEditingText] = useState("");
  const [tipCounts, setTipCounts] = useState<Record<string, EngagementCounts>>({});

  useEffect(() => {
    const posts = JSON.parse(
      localStorage.getItem("student-square-posts") ?? "[]"
    ) as PopularTip[];

    const hiddenIds = JSON.parse(
      localStorage.getItem("student-square-hidden-posts") ?? "[]"
    ) as string[];

    setStoredPosts(
      posts.map((post) => ({
        ...post,
        detail: post.detail ?? post.summary,
        lastVerified: post.lastVerified ?? "-",
        status: post.status ?? "방금 작성됨",
        isMine: true,
      }))
    );

    setHiddenPostIds(hiddenIds);

    const handleHiddenPostsUpdated = () => {
      const nextHiddenIds = JSON.parse(
        localStorage.getItem("student-square-hidden-posts") ?? "[]"
      ) as string[];

      setHiddenPostIds(nextHiddenIds);
    };

    window.addEventListener("student-square-hidden-posts-updated", handleHiddenPostsUpdated);

    return () => {
      window.removeEventListener("student-square-hidden-posts-updated", handleHiddenPostsUpdated);
    };
  }, []);

  const saveStoredPosts = (posts: PopularTip[]) => {
    const fixedPosts = posts.map((post) => ({
      ...post,
      isMine: true,
    }));

    setStoredPosts(fixedPosts);
    localStorage.setItem("student-square-posts", JSON.stringify(fixedPosts));
  };

  const popularTips = useMemo(() => {
    return [...storedPosts, ...sampleTips]
      .filter((tip) => !hiddenPostIds.includes(tip.id))
      .sort((a, b) => {
        const aCounts = tipCounts[a.id];
        const bCounts = tipCounts[b.id];

        return (bCounts?.bookmarks ?? b.bookmarks) - (aCounts?.bookmarks ?? a.bookmarks);
      });
  }, [storedPosts, hiddenPostIds, tipCounts]);

  const handleEditStart = (tip: PopularTip) => {
    if (!tip.isMine) return;

    setEditingPostId(tip.id);
    setEditingTitle(tip.title);
    setEditingText(tip.summary);
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

    const updatedPosts = storedPosts.map((post) =>
      post.id === postId
        ? {
            ...post,
            title: trimmedTitle,
            summary: trimmedText,
            detail: trimmedText,
          }
        : post
    );

    saveStoredPosts(updatedPosts);
    setEditingPostId(null);
    setEditingTitle("");
    setEditingText("");
  };

  const handleDelete = (postId: string) => {
    const ok = confirm("이 글을 삭제할까요?");
    if (!ok) return;

    saveStoredPosts(storedPosts.filter((post) => post.id !== postId));
  };

  const renderTipCard = (tip: PopularTip) => {
    const isExpanded = expandedTipId === tip.id;
    const isEditing = editingPostId === tip.id;
    const counts = tipCounts[tip.id] ?? {
      useful: tip.useful,
      bookmarks: tip.bookmarks,
      verified: tip.verified ?? 0,
    };

    const detailText =
      (tip.detail ?? tip.summary).trim() === tip.summary.trim()
        ? ""
        : (tip.detail ?? tip.summary).trim().startsWith(tip.summary.trim())
          ? (tip.detail ?? tip.summary).trim().slice(tip.summary.trim().length).trim()
          : (tip.detail ?? tip.summary).trim();

    return (
      <Card key={tip.id}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{tip.tipCategory ?? tip.category}</Badge>
                <Badge variant="outline">{tip.status ?? "현재 유효"}</Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                {tip.authorName ?? "꿀팁러 #0000"}
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

                  {tip.imageUrl && (
                    <img
                      src={tip.imageUrl}
                      alt="첨부 이미지"
                      className="max-h-[320px] w-full rounded-xl border object-cover"
                    />
                  )}
                </div>
              ) : (
                <>
                  <CardTitle className="text-lg leading-relaxed">
                    {tip.title}
                  </CardTitle>

                  <CardDescription className="leading-relaxed">
                    {isExpanded && detailText
                      ? `${tip.summary} ${detailText}`
                      : tip.summary}
                  </CardDescription>

                  {tip.imageUrl && (
                    <img
                      src={tip.imageUrl}
                      alt="첨부 이미지"
                      className="mt-3 max-h-[320px] w-full rounded-xl border object-cover"
                    />
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}

              <TipActionMenu
                isMine={Boolean(tip.isMine)}
                postId={tip.id}
                postTitle={tip.title}
                onEdit={() => handleEditStart(tip)}
                onDelete={() => handleDelete(tip.id)}
                onBlock={() =>
                  setHiddenPostIds((prev) => Array.from(new Set([...prev, tip.id])))
                }
              />
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

              <Button size="sm" onClick={() => handleEditSave(tip.id)}>
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            </div>
          ) : (
            <TipEngagementActions
              postId={tip.id}
              title={tip.title}
              summary={tip.summary}
              category={tip.tipCategory ?? tip.category}
              useful={counts.useful}
              bookmarks={counts.bookmarks}
              verified={counts.verified}
              createdAt={tip.createdAt}
              createdAtMs={tip.createdAtMs}
              lastVerified={tip.lastVerified ?? "-"}
              status={tip.status ?? "현재 유효"}
              imageUrl={tip.imageUrl}
              authorName={tip.authorName}
              authorNumber={tip.authorNumber}
              onCountsChange={(nextCounts) =>
                setTipCounts((prev) => ({
                  ...prev,
                  [tip.id]: nextCounts,
                }))
              }
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookMarked className="h-7 w-7" />
            북마크 많은 꿀팁
          </h1>

          <p className="text-muted-foreground mt-2">
            북마크 수가 높은 꿀팁부터 확인할 수 있습니다.
          </p>
        </div>

        {popularTips.length > 0 ? (
          <div className="space-y-4">
            {popularTips.map(renderTipCard)}
          </div>
        ) : (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-lg font-semibold">표시할 꿀팁이 없습니다.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                북마크가 많은 꿀팁이 생기면 이곳에서 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
