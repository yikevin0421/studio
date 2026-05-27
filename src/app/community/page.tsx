"use client"

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TipEngagementActions } from "@/components/tip-engagement-actions";
import { Button } from "@/components/ui/button";
import { TipActionMenu } from "@/components/tip-action-menu";
import {
  MessageSquare,
    Save,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type CommunityTip = {
  id: string;
  title: string;
  summary: string;
  category: "최근 뜨는 꿀팁" | "유용한 꿀팁" | "과거의 꿀팁";
  tipCategory?: string;
  useful: number;
  bookmarks: number;
  verified: number;
  createdAt: string;
  createdAtMs: number;
  lastVerified: string;
  status: string;
  imageUrl?: string;
  isMine?: boolean;
};

const sampleTips: CommunityTip[] = [
  {
    id: "sample-001",
    title: "사범대 라운지에 전자레인지와 뜨거운 물 나오는 공간이 있습니다",
    summary: "공강 시간이나 시험기간에 도시락이나 컵라면을 먹기 좋은 공간입니다. 사범대 라운지에는 전자레인지와 뜨거운 물을 이용할 수 있는 공간이 있어 시험기간이나 공강 시간에 간단히 식사하기 좋습니다.",
    category: "최근 뜨는 꿀팁",
    useful: 128,
    bookmarks: 86,
    verified: 32,
    createdAt: "2026.05.27 14:20",
    createdAtMs: 1779862800000,
    lastVerified: "2026.05.26",
    status: "현재 유효",
    isMine: false,
  },
  {
    id: "sample-002",
    title: "국가근로 신청 전 희망근로지 모집 여부를 먼저 확인하면 시간을 줄일 수 있습니다",
    summary: "희망근로지 모집 여부와 선발 조건을 먼저 확인하면 불필요한 지원을 줄일 수 있습니다. 국가근로는 신청 자체도 중요하지만 실제 희망근로지가 모집 중인지, 본인의 시간표와 근로 시간이 맞는지도 중요합니다.",
    category: "유용한 꿀팁",
    useful: 187,
    bookmarks: 65,
    verified: 39,
    createdAt: "2026.05.26 18:10",
    createdAtMs: 1779786600000,
    lastVerified: "2026.04.15",
    status: "최근 검증됨",
    isMine: false,
  },
  {
    id: "sample-003",
    title: "이전 학생회관 무인 프린터 이용 방법",
    summary: "시설 변경으로 현재는 그대로 이용하기 어려운 정보입니다.",
    category: "과거의 꿀팁",
    useful: 42,
    bookmarks: 18,
    verified: 5,
    createdAt: "2026.05.18 15:00",
    createdAtMs: 1779084000000,
    lastVerified: "2026.05.18",
    status: "이용 불가",
    isMine: false,
  },
];

const boardMap = {
  hot: "최근 뜨는 꿀팁",
  useful: "유용한 꿀팁",
  past: "과거의 꿀팁",
} as const;

export default function CommunityPage() {
  const searchParams = useSearchParams();
  const board = searchParams.get("board") as keyof typeof boardMap | null;
  const selectedCategory = board ? boardMap[board] : null;

  const [storedPosts, setStoredPosts] = useState<CommunityTip[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);

  useEffect(() => {
    const posts = JSON.parse(
      localStorage.getItem("student-square-posts") ?? "[]"
    ) as CommunityTip[];

    setStoredPosts(
      posts.map((post) => ({
        ...post,
        isMine: true,
        verified: post.verified ?? 0,
        lastVerified: post.lastVerified ?? "-",
        status: post.status ?? "방금 작성됨",
      }))
    );
  }, []);

  const saveStoredPosts = (posts: CommunityTip[]) => {
    const fixedPosts = posts.map((post) => ({
      ...post,
      isMine: true,
    }));

    setStoredPosts(fixedPosts);
    localStorage.setItem("student-square-posts", JSON.stringify(fixedPosts));
  };

  const handleEditStart = (tip: CommunityTip) => {
    if (!tip.isMine) return;
    setEditingPostId(tip.id);
    setEditingText(tip.summary);
  };

  const handleEditCancel = () => {
    setEditingPostId(null);
    setEditingText("");
  };

  const handleEditSave = (postId: string) => {
    const trimmedText = editingText.trim();
    if (!trimmedText) return;

    const updatedPosts = storedPosts.map((post) =>
      post.id === postId
        ? {
            ...post,
            title:
              trimmedText.length > 40
                ? `${trimmedText.slice(0, 40)}...`
                : trimmedText,
            summary: trimmedText,
          }
        : post
    );

    saveStoredPosts(updatedPosts);
    setEditingPostId(null);
    setEditingText("");
  };

  const handleDelete = (postId: string) => {
    const ok = confirm("이 글을 삭제할까요?");
    if (!ok) return;
    saveStoredPosts(storedPosts.filter((post) => post.id !== postId));
  };

  const toggleExpand = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredTips = useMemo(() => {
    const tips = [...storedPosts, ...sampleTips];

    const filtered = selectedCategory
      ? tips.filter((tip) => tip.category === selectedCategory)
      : tips;

    return [...filtered].sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [selectedCategory, storedPosts]);

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-7 w-7" />
            {selectedCategory ?? "커뮤니티"}
          </h1>

          <p className="text-muted-foreground mt-2">
            가장 최신에 작성된 글부터 확인할 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          {filteredTips.map((tip) => {
            const isEditing = editingPostId === tip.id;
            const isExpanded = expandedPostIds.includes(tip.id);
            const shouldTruncate = tip.summary.length > 90;
            const displaySummary =
              shouldTruncate && !isExpanded
                ? `${tip.summary.slice(0, 90)}...`
                : tip.summary;

            return (
              <Card key={tip.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{tip.tipCategory ?? tip.category}</Badge>
                        <Badge variant="outline">{tip.status}</Badge>
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
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
                            {displaySummary}
                          </CardDescription>

                          {tip.imageUrl && (
                            <img
                              src={tip.imageUrl}
                              alt="첨부 이미지"
                              className="mt-3 max-h-[320px] w-full rounded-xl border object-cover"
                            />
                          )}

                          {shouldTruncate && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto px-0 text-primary"
                              onClick={() => toggleExpand(tip.id)}
                            >
                              {isExpanded ? (
                                <>
                                  접기
                                  <ChevronUp className="ml-1 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  펼쳐보기
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {tip.createdAt}
                      </span>

                      <TipActionMenu
                        isMine={Boolean(tip.isMine)}
                        onEdit={() => handleEditStart(tip)}
                        onDelete={() => handleDelete(tip.id)}
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
                      useful={tip.useful}
                      bookmarks={tip.bookmarks}
                      verified={tip.verified ?? 0}
                      createdAt={tip.createdAt}
                      createdAtMs={tip.createdAtMs}
                      lastVerified={tip.lastVerified ?? "-"}
                      status={tip.status}
                      imageUrl={tip.imageUrl}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
