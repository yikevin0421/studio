"use client"

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TipEngagementActions } from "@/components/tip-engagement-actions";
import { TipActionMenu } from "@/components/tip-action-menu";
import {
  Search,
  Pencil,
  BookMarked,
  RefreshCw,
  Flame,
  Star,
  ArchiveX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Tip = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  category: string;
  tipCategory?: string;
  useful: number;
  bookmarks: number;
  verified: number;
  createdAt?: string;
  createdAtMs?: number;
  lastVerified: string;
  status: string;
  time?: string;
  note?: string;
  imageUrl?: string;
  authorName?: string;
  authorNumber?: number;
};

type EngagementCounts = {
  useful: number;
  bookmarks: number;
  verified: number;
};

const recentHotTips: Tip[] = [
  {
    id: "tip-001",
    title: "사범대 라운지에 전자레인지와 뜨거운 물 나오는 공간이 있습니다",
    summary: "사범대 라운지에는 전자레인지와 온수가 있어 간단히 도시락이나 컵라면을 먹기 좋습니다.",
    detail: "사범대 라운지에는 전자레인지와 뜨거운 물을 이용할 수 있는 공간이 있어 시험기간이나 공강 시간에 간단히 식사하기 좋습니다. 다만 학교 시설은 변경될 수 있으므로 최근 검증일과 학생들의 검증 수를 함께 확인하는 것이 좋습니다.",
    category: "학교생활",
    useful: 128,
    bookmarks: 86,
    verified: 32,
    lastVerified: "2026.05.26",
    status: "현재 유효",
    time: "2시간 전",
    authorName: "꿀팁러 #1001",
    authorNumber: 1001,
  },
  {
    id: "tip-002",
    title: "도서관 시험기간 24시간 운영 시기에는 3층 좌석이 비교적 여유롭습니다",
    summary: "시험기간에는 도서관 좌석 경쟁이 심하지만, 3층 일부 좌석은 상대적으로 여유로운 편입니다.",
    detail: "시험기간에는 도서관 열람실 좌석이 빠르게 차는 경우가 많습니다. 이때 3층 좌석이나 상대적으로 이동 동선이 긴 공간은 비교적 늦게 차는 편이라 공부 공간을 찾는 학생들에게 도움이 될 수 있습니다.",
    category: "공부공간",
    useful: 96,
    bookmarks: 72,
    verified: 21,
    lastVerified: "2026.05.25",
    status: "최근 검증됨",
    time: "5시간 전",
    authorName: "꿀팁러 #1002",
    authorNumber: 1002,
  },
  {
    id: "tip-003",
    title: "수강정정 기간에는 전공 사무실보다 학과 공지방을 먼저 확인하는 것이 빠릅니다",
    summary: "수강정정 기간에는 전화 문의가 몰릴 수 있으므로 학과 공지방과 공지사항을 먼저 확인하는 것이 좋습니다.",
    detail: "수강정정 기간에는 전공 사무실에 문의가 몰리는 경우가 많아 전화 연결이 늦어질 수 있습니다. 따라서 학과 공지방, 학과 홈페이지, LMS 공지사항을 먼저 확인하면 정정 가능 과목이나 여석 안내를 더 빠르게 파악할 수 있습니다.",
    category: "수강신청",
    useful: 74,
    bookmarks: 44,
    verified: 18,
    lastVerified: "2026.05.24",
    status: "현재 유효",
    time: "8시간 전",
    authorName: "꿀팁러 #1003",
    authorNumber: 1003,
  },
];

const mostUsefulTips: Tip[] = [
  {
    id: "tip-004",
    title: "타대학 K-MOOC 원격강좌 학점인정은 매 학기 공지를 다시 확인해야 합니다",
    summary: "K-MOOC 학점인정은 매 학기 신청 기간과 인정 기준이 달라질 수 있어 최신 공지를 확인해야 합니다.",
    detail: "타대학 K-MOOC 원격강좌 학점인정은 한 번 올라온 정보가 계속 동일하게 적용되는 것이 아니라 매 학기 신청 기간, 인정 기준, 제출 서류가 달라질 수 있습니다.",
    category: "학점인정",
    useful: 214,
    bookmarks: 59,
    verified: 45,
    lastVerified: "2026.03.04",
    status: "갱신형 정보",
    note: "매 학기 확인 필요",
    authorName: "꿀팁러 #1004",
    authorNumber: 1004,
  },
  {
    id: "tip-005",
    title: "국가근로 신청 전 희망근로지 모집 여부를 먼저 확인하면 시간을 줄일 수 있습니다",
    summary: "국가근로 신청 전 희망근로지 모집 여부와 선발 조건을 확인하면 불필요한 지원을 줄일 수 있습니다.",
    detail: "국가근로는 신청 자체도 중요하지만 실제 희망근로지가 모집 중인지, 본인의 시간표와 근로 시간이 맞는지도 중요합니다.",
    category: "장학/근로",
    useful: 187,
    bookmarks: 65,
    verified: 39,
    lastVerified: "2026.04.15",
    status: "최근 검증됨",
    note: "학기별 변동 가능",
    authorName: "꿀팁러 #1005",
    authorNumber: 1005,
  },
  {
    id: "tip-006",
    title: "프린트가 급할 때는 중앙도서관보다 학과 건물 복사기를 확인하는 것이 빠릅니다",
    summary: "출력 대기 줄이 길 때는 학과 건물 복사기나 주변 출력 가능한 공간을 확인하는 것이 좋습니다.",
    detail: "과제 제출 직전에는 중앙도서관이나 학생회관 출력 공간에 사람이 몰릴 수 있습니다. 이럴 때는 학과 건물 내 복사기나 근처 출력 가능한 공간을 확인하면 시간을 줄일 수 있습니다.",
    category: "학교생활",
    useful: 152,
    bookmarks: 51,
    verified: 27,
    lastVerified: "2026.05.20",
    status: "현재 유효",
    note: "시설 변경 시 신고 필요",
    authorName: "꿀팁러 #1006",
    authorNumber: 1006,
  },
];

const removedTips = [
  {
    title: "이전 학생회관 무인 프린터 이용 방법",
    reason: "시설 변경으로 이용 불가",
    removedAt: "2026.05.18",
  },
  {
    title: "구 버전 비교과 신청 링크 모음",
    reason: "신청 페이지 변경",
    removedAt: "2026.05.12",
  },
];

export default function DashboardPage() {
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tipCounts, setTipCounts] = useState<Record<string, EngagementCounts>>({});
  const [storedPosts, setStoredPosts] = useState<Tip[]>([]);
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);

  useEffect(() => {
    const posts = JSON.parse(
      localStorage.getItem("student-square-posts") ?? "[]"
    ) as Tip[];

    const hiddenIds = JSON.parse(
      localStorage.getItem("student-square-hidden-posts") ?? "[]"
    ) as string[];

    setStoredPosts(
      posts.map((post) => ({
        ...post,
        detail: post.detail ?? post.summary,
        lastVerified: post.lastVerified ?? "-",
        status: post.status ?? "방금 작성됨",
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

  const allTips = useMemo(() => {
    return [...storedPosts, ...recentHotTips, ...mostUsefulTips].filter(
      (tip) => !hiddenPostIds.includes(tip.id)
    );
  }, [storedPosts, hiddenPostIds]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return allTips.filter((tip) => {
      return (
        tip.title.toLowerCase().includes(query) ||
        tip.summary.toLowerCase().includes(query) ||
        tip.detail.toLowerCase().includes(query) ||
        tip.category.toLowerCase().includes(query) ||
        (tip.tipCategory ?? "").toLowerCase().includes(query)
      );
    });
  }, [allTips, searchQuery]);

  const quickActions = [
    {
      label: "글 쓰기",
      icon: Pencil,
      href: "/write",
    },
    {
      label: "북마크 많은 꿀팁",
      icon: BookMarked,
      href: "/popular-bookmarks",
    },
    {
      label: "검증 필요 글 보기",
      icon: RefreshCw,
      href: "/community",
    },
  ];

  const renderTipCard = (tip: Tip) => {
    const isExpanded = expandedTipId === tip.id;
    const counts = tipCounts[tip.id] ?? {
      useful: tip.useful,
      bookmarks: tip.bookmarks,
      verified: tip.verified ?? 0,
    };
    const detailText =
      tip.detail.trim() === tip.summary.trim()
        ? ""
        : tip.detail.trim().startsWith(tip.summary.trim())
          ? tip.detail.trim().slice(tip.summary.trim().length).trim()
          : tip.detail.trim();

    return (
      <div
        key={tip.id}
        onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
        className="relative p-4 rounded-xl border transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{tip.tipCategory ?? (tip.category === "최근 뜨는 꿀팁" ? "학교생활" : tip.category)}</Badge>
              <Badge variant="outline">{tip.status}</Badge>
            </div>

            <div
              className="absolute right-9 top-2"
              onClick={(event) => event.stopPropagation()}
            >
              <TipActionMenu
                isMine={Boolean(tip.id.startsWith("post-"))}
                postId={tip.id}
                postTitle={tip.title}
                onBlock={() =>
                  setHiddenPostIds((prev) => Array.from(new Set([...prev, tip.id])))
                }
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {tip.authorName ?? "꿀팁러 #0000"}
            </p>

            <h3 className="font-semibold leading-relaxed">{tip.title}</h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {isExpanded && detailText
                ? `${tip.summary} ${detailText}`
                : tip.summary}
            </p>

            {tip.imageUrl && (
              <img
                src={tip.imageUrl}
                alt="첨부 이미지"
                className="mt-3 max-h-[320px] w-full rounded-xl border object-cover"
              />
            )}
          </div>

          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {tip.time && <span>{tip.time}</span>}
          <span>유용해요 {counts.useful}</span>
          <span>북마크 {counts.bookmarks}</span>
          <span>검증 {counts.verified}명</span>
          <span>최근 검증일 {tip.lastVerified}</span>
        </div>

        {isExpanded && (
          <div
            className="mt-3 border-t pt-3"
            onClick={(event) => event.stopPropagation()}
          >
            <TipEngagementActions
              postId={tip.id}
              title={tip.title}
              summary={tip.summary}
              category={tip.tipCategory ?? (tip.category === "최근 뜨는 꿀팁" ? "학교생활" : tip.category)}
              useful={counts.useful}
              bookmarks={counts.bookmarks}
              verified={counts.verified}
              createdAt={tip.createdAt}
              createdAtMs={tip.createdAtMs}
              lastVerified={tip.lastVerified ?? "-"}
              status={tip.status}
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
          </div>
        )}
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">대구대 꿀팁 홈</h1>
          <p className="text-muted-foreground mt-2">
            학교생활에 필요한 꿀팁을 검색하고 확인할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>꿀팁 검색</CardTitle>
            <CardDescription>
              메인 화면에서 학교생활 꿀팁을 바로 검색할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="예: 도서관, 국가근로, 전자레인지, 수강정정"
                className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
              />
            </div>

            {searchQuery.trim() && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  검색 결과 {searchResults.length}개
                </p>

                {searchResults.length > 0 ? (
                  searchResults.map(renderTipCard)
                ) : (
                  <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 실행</CardTitle>
            <CardDescription>자주 사용하는 기능으로 바로 이동합니다.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Button key={action.label} variant="outline" asChild className="h-20 justify-start">
                  <Link href={action.href} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{action.label}</span>
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                최근 뜨는 꿀팁
              </CardTitle>
              <CardDescription>최근 학생들이 많이 확인한 꿀팁입니다.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {recentHotTips.filter((tip) => !hiddenPostIds.includes(tip.id)).map(renderTipCard)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                유용한 꿀팁
              </CardTitle>
              <CardDescription>유용해요 수가 높은 꿀팁입니다.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {mostUsefulTips.filter((tip) => !hiddenPostIds.includes(tip.id)).map(renderTipCard)}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArchiveX className="h-5 w-5" />
              과거의 꿀팁
            </CardTitle>
            <CardDescription>이전에는 유용했지만 현재는 확인이 필요한 꿀팁입니다.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {removedTips.map((tip) => (
              <div key={tip.title} className="rounded-xl border p-4">
                <h3 className="font-semibold">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tip.reason}</p>
                <p className="text-xs text-muted-foreground mt-2">정리일 {tip.removedAt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
