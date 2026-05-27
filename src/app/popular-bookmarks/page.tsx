"use client"

import { useMemo, useState } from "react";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  Clock3,
  Search,
  ThumbsUp,
} from "lucide-react";

type PopularTip = {
  id: string;
  title: string;
  summary: string;
  category: string;
  bookmarks: number;
  useful: number;
  verified: number;
  lastVerified: string;
};

const popularTips: PopularTip[] = [
  {
    id: "tip-001",
    title: "사범대 라운지에 전자레인지와 뜨거운 물 나오는 공간이 있습니다",
    summary: "공강 시간이나 시험기간에 간단히 식사할 수 있는 학교생활 꿀팁입니다.",
    category: "학교생활",
    bookmarks: 86,
    useful: 128,
    verified: 32,
    lastVerified: "2026.05.26",
  },
  {
    id: "tip-002",
    title: "도서관 시험기간 24시간 운영 시기에는 3층 좌석이 비교적 여유롭습니다",
    summary: "시험기간 공부공간을 찾는 학생들에게 도움이 되는 꿀팁입니다.",
    category: "공부공간",
    bookmarks: 72,
    useful: 96,
    verified: 21,
    lastVerified: "2026.05.25",
  },
  {
    id: "tip-003",
    title: "국가근로 신청 전 희망근로지 모집 여부를 먼저 확인하면 시간을 줄일 수 있습니다",
    summary: "국가근로 신청 전 확인하면 좋은 장학/근로 관련 꿀팁입니다.",
    category: "장학/근로",
    bookmarks: 65,
    useful: 187,
    verified: 39,
    lastVerified: "2026.04.15",
  },
  {
    id: "tip-004",
    title: "프린트가 급할 때는 중앙도서관보다 학과 건물 복사기를 확인하는 것이 빠릅니다",
    summary: "출력 대기 줄이 길 때 참고하기 좋은 학교생활 꿀팁입니다.",
    category: "학교생활",
    bookmarks: 51,
    useful: 152,
    verified: 27,
    lastVerified: "2026.05.20",
  },
  {
    id: "tip-005",
    title: "수강정정 기간에는 전공 사무실보다 학과 공지방을 먼저 확인하는 것이 빠릅니다",
    summary: "수강정정 기간에 빠르게 정보를 확인하는 방법입니다.",
    category: "수강신청",
    bookmarks: 44,
    useful: 74,
    verified: 18,
    lastVerified: "2026.05.24",
  },
];

const categories = ["전체", "학교생활", "공부공간", "장학/근로", "수강신청"];

export default function PopularBookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredTips = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return popularTips
      .filter((tip) => {
        const matchesCategory =
          selectedCategory === "전체" || tip.category === selectedCategory;

        const matchesSearch =
          query.length === 0 ||
          tip.title.toLowerCase().includes(query) ||
          tip.summary.toLowerCase().includes(query) ||
          tip.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.bookmarks - a.bookmarks);
  }, [searchQuery, selectedCategory]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              대시보드로 돌아가기
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookMarked className="h-7 w-7" />
            북마크 많은 꿀팁
          </h1>

          <p className="text-muted-foreground mt-2">
            학생들이 많이 북마크한 꿀팁을 많은 순서대로 확인할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>꿀팁 검색</CardTitle>
            <CardDescription>
              제목, 내용, 카테고리로 북마크가 많은 꿀팁을 검색할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="예: 도서관, 국가근로, 전자레인지"
                className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {filteredTips.length}개의 꿀팁
          </p>
          <p className="text-sm text-muted-foreground">
            정렬 기준: 북마크 많은 순
          </p>
        </div>

        <div className="space-y-4">
          {filteredTips.map((tip, index) => (
            <Card key={tip.id} className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{tip.category}</Badge>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>

                    <CardTitle className="text-lg leading-relaxed">
                      {tip.title}
                    </CardTitle>

                    <CardDescription className="leading-relaxed">
                      {tip.summary}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-primary whitespace-nowrap">
                    <BookMarked className="h-4 w-4" />
                    {tip.bookmarks}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    유용해요 {tip.useful}
                  </span>

                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    검증 {tip.verified}명
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    최근 검증일 {tip.lastVerified}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTips.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                검색 결과가 없습니다.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}