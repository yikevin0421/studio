"use client"

import { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  MessageSquare,
  Flame,
  Star,
  Pencil,
  BookMarked,
  ThumbsUp,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArchiveX,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Flag
} from 'lucide-react';
import Link from 'next/link';

type Tip = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  category: string;
  useful: number;
  verified: number;
  lastVerified: string;
  status: string;
  time?: string;
  note?: string;
};

export default function DashboardPage() {
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [reportTipId, setReportTipId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reportReasons = [
    '제도나 운영 방식이 변경되었습니다',
    '시설이 사라졌거나 현재 이용할 수 없습니다',
    '링크 또는 신청 페이지가 변경되었습니다',
    '기간이 지나 현재는 사용할 수 없는 정보입니다',
    '내용이 사실과 다릅니다',
    '기타 사유가 있습니다'
  ];

  const recentHotTips: Tip[] = [
    {
      id: 'tip-001',
      title: '사범대 라운지에 전자레인지와 뜨거운 물 나오는 공간이 있습니다',
      summary: '사범대 라운지에는 전자레인지와 온수가 있어 간단히 도시락이나 컵라면을 먹기 좋습니다.',
      detail: '사범대 라운지에는 전자레인지와 뜨거운 물을 이용할 수 있는 공간이 있어 시험기간이나 공강 시간에 간단히 식사하기 좋습니다. 다만 학교 시설은 변경될 수 있으므로 최근 검증일과 학생들의 검증 수를 함께 확인하는 것이 좋습니다.',
      category: '학교생활',
      useful: 128,
      verified: 32,
      lastVerified: '2026.05.26',
      status: '현재 유효',
      time: '2시간 전'
    },
    {
      id: 'tip-002',
      title: '도서관 시험기간 24시간 운영 시기에는 3층 좌석이 비교적 여유롭습니다',
      summary: '시험기간에는 도서관 좌석 경쟁이 심하지만, 3층 일부 좌석은 상대적으로 여유로운 편입니다.',
      detail: '시험기간에는 도서관 열람실 좌석이 빠르게 차는 경우가 많습니다. 이때 3층 좌석이나 상대적으로 이동 동선이 긴 공간은 비교적 늦게 차는 편이라 공부 공간을 찾는 학생들에게 도움이 될 수 있습니다. 단, 시험기간 운영 방식은 학기마다 달라질 수 있어 최근 검증이 필요합니다.',
      category: '공부공간',
      useful: 96,
      verified: 21,
      lastVerified: '2026.05.25',
      status: '최근 검증됨',
      time: '5시간 전'
    },
    {
      id: 'tip-003',
      title: '수강정정 기간에는 전공 사무실보다 학과 공지방을 먼저 확인하는 것이 빠릅니다',
      summary: '수강정정 기간에는 전화 문의가 몰릴 수 있으므로 학과 공지방과 공지사항을 먼저 확인하는 것이 좋습니다.',
      detail: '수강정정 기간에는 전공 사무실에 문의가 몰리는 경우가 많아 전화 연결이 늦어질 수 있습니다. 따라서 학과 공지방, 학과 홈페이지, LMS 공지사항을 먼저 확인하면 정정 가능 과목이나 여석 안내를 더 빠르게 파악할 수 있습니다.',
      category: '수강신청',
      useful: 74,
      verified: 18,
      lastVerified: '2026.05.24',
      status: '현재 유효',
      time: '8시간 전'
    }
  ];

  const mostUsefulTips: Tip[] = [
    {
      id: 'tip-004',
      title: '타대학 K-MOOC 원격강좌 학점인정은 매 학기 공지를 다시 확인해야 합니다',
      summary: 'K-MOOC 학점인정은 매 학기 신청 기간과 인정 기준이 달라질 수 있어 최신 공지를 확인해야 합니다.',
      detail: '타대학 K-MOOC 원격강좌 학점인정은 한 번 올라온 정보가 계속 동일하게 적용되는 것이 아니라 매 학기 신청 기간, 인정 기준, 제출 서류가 달라질 수 있습니다. 따라서 이 정보는 폐지된 정보로 내리기보다 “갱신형 정보”로 관리하는 것이 적합합니다.',
      category: '학점인정',
      useful: 214,
      verified: 45,
      lastVerified: '2026.03.04',
      status: '갱신형 정보',
      note: '매 학기 확인 필요'
    },
    {
      id: 'tip-005',
      title: '국가근로 신청 전 희망근로지 모집 여부를 먼저 확인하면 시간을 줄일 수 있습니다',
      summary: '국가근로 신청 전 희망근로지 모집 여부와 선발 조건을 확인하면 불필요한 지원을 줄일 수 있습니다.',
      detail: '국가근로는 신청 자체도 중요하지만 실제 희망근로지가 모집 중인지, 본인의 시간표와 근로 시간이 맞는지도 중요합니다. 단순히 신청 기간만 보고 지원하기보다 학교 공지와 장학 관련 안내를 함께 확인하는 것이 좋습니다.',
      category: '장학/근로',
      useful: 187,
      verified: 39,
      lastVerified: '2026.04.15',
      status: '최근 검증됨',
      note: '학기별 변동 가능'
    },
    {
      id: 'tip-006',
      title: '프린트가 급할 때는 중앙도서관보다 학과 건물 복사기를 확인하는 것이 빠릅니다',
      summary: '출력 대기 줄이 길 때는 학과 건물 복사기나 주변 출력 가능한 공간을 확인하는 것이 좋습니다.',
      detail: '과제 제출 직전에는 중앙도서관이나 학생회관 출력 공간에 사람이 몰릴 수 있습니다. 이럴 때는 학과 건물 내 복사기나 근처 출력 가능한 공간을 확인하면 시간을 줄일 수 있습니다. 단, 복사기 위치나 운영 여부는 변경될 수 있으므로 검증이 필요합니다.',
      category: '학교생활',
      useful: 152,
      verified: 27,
      lastVerified: '2026.05.20',
      status: '현재 유효',
      note: '시설 변경 시 신고 필요'
    }
  ];

  const removedTips = [
    {
      title: '이전 학생회관 무인 프린터 이용 방법',
      reason: '시설 변경으로 이용 불가',
      removedAt: '2026.05.18'
    },
    {
      title: '구 버전 비교과 신청 링크 모음',
      reason: '신청 페이지 변경',
      removedAt: '2026.05.12'
    }
  ];

  const quickActions = [
    {
      label: '글 쓰기',
      icon: Pencil,
      href: '/community',
    },
    {
      label: '북마크 많은 꿀팁',
      icon: BookMarked,
      href: '/popular-bookmarks',
    },
    {
      label: '검증 필요 글 보기',
      icon: RefreshCw,
      href: '/community',
    },
  ];

  const handleExpand = (tipId: string) => {
    setExpandedTipId(expandedTipId === tipId ? null : tipId);
    setReportTipId(null);
    setSelectedReason(null);
  };

  const handleReportOpen = (event: React.MouseEvent, tipId: string) => {
    event.stopPropagation();
    setReportTipId(reportTipId === tipId ? null : tipId);
    setSelectedReason(null);
  };

  const handleReasonSelect = (event: React.MouseEvent, reason: string) => {
    event.stopPropagation();
    setSelectedReason(reason);
  };

  const renderTipCard = (tip: Tip) => {
  const isExpanded = expandedTipId === tip.id;
  const isReportOpen = reportTipId === tip.id;

  const metaInfo = (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {tip.time && (
        <>
          <span>{tip.time}</span>
          <span>•</span>
        </>
      )}

      <span className="text-primary font-medium flex items-center gap-1">
        <ThumbsUp className="h-3 w-3" />
        유용해요 {tip.useful}
      </span>

      <span>•</span>

      <span className="flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        검증 {tip.verified}명
      </span>

      <span>•</span>

      <span className="flex items-center gap-1">
        <Clock3 className="h-3 w-3" />
        최근 검증일 {tip.lastVerified}
      </span>
    </div>
  );

  return (
    <div
      key={tip.id}
      onClick={() => handleExpand(tip.id)}
      className="p-4 rounded-xl border hover:bg-accent transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <Star className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{tip.category}</Badge>
              <Badge variant="outline">{tip.status}</Badge>
            </div>

            <h4 className="font-semibold group-hover:text-primary transition-colors leading-relaxed">
              {tip.title}
            </h4>

            {!isExpanded && (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {tip.summary}
                </p>

                {metaInfo}
              </>
            )}
          </div>
        </div>

        <Button variant="ghost" size="icon" className="shrink-0">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-3 ml-14 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tip.detail}
          </p>

          <div className="pt-3 border-t grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={(event) => event.stopPropagation()}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              유용해요
            </Button>

            <Button variant="outline" size="sm" onClick={(event) => event.stopPropagation()}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              최근에도 맞아요
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={(event) => handleReportOpen(event, tip.id)}
            >
              <Flag className="h-4 w-4 mr-2" />
              더 이상 꿀팁이 아니에요
            </Button>
          </div>

          {isReportOpen && (
            <div className="rounded-xl border bg-background p-4 space-y-3">
              <div>
                <h5 className="font-semibold text-sm">어떤 이유에 해당하나요?</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  선택 즉시 글이 내려가지는 않고, 누적 신고와 검토 절차를 거친 뒤 인기 목록에서 제외됩니다.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {reportReasons.map((reason) => (
                  <Button
                    key={reason}
                    variant={selectedReason === reason ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={(event) => handleReasonSelect(event, reason)}
                  >
                    {reason}
                  </Button>
                ))}
              </div>

              {selectedReason && (
                <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
                  선택한 사유: {selectedReason}
                  <br />
                  실제 서비스에서는 해당 사유가 누적되어 검토 목록으로 이동합니다.
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t">
            {metaInfo}
          </div>
        </div>
      )}
    </div>
  );
};
  return (
    <AuthenticatedLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary">
              대구대 꿀팁 홈
            </h1>
            <p className="text-muted-foreground mt-2">
              방대한 학교 정보 속에서 학생들이 직접 검증한 유용한 꿀팁만 모아 보여줍니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
              데모 사용자
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm rounded-full">
              꿀팁 검증 참여 가능
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">검증된 꿀팁</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground mt-1">
                최근 검증일이 표시된 유효한 정보
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">오늘 등록된 꿀팁</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                학생들이 새로 제보한 학교생활 정보
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">이번 주 인기 키워드</CardTitle>
              <Flame className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">시험기간 꿀팁</div>
              <p className="text-xs text-muted-foreground mt-1">
                #도서관 #공부공간 #프린트 #컵라면
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  최근에 인기 있는 꿀팁
                </CardTitle>
                <CardDescription>
                  최근 반응이 빠르게 늘어난 꿀팁입니다. 제목과 요약을 먼저 확인하고, 클릭하면 상세 내용을 펼쳐볼 수 있습니다.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {recentHotTips.map((tip) => renderTipCard(tip))}
                </div>

                <Button variant="link" className="w-full mt-4" asChild>
                  <Link href="/community">모든 꿀팁 보기</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  유용해요 많은 순
                </CardTitle>
                <CardDescription>
                  학생들이 가장 많이 유용하다고 평가한 꿀팁입니다. 매 학기 갱신형 정보는 별도 표시됩니다.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {mostUsefulTips.map((tip) => renderTipCard(tip))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">빠른 실행</CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-3">
                {quickActions.map((action) => (
                  <Button key={action.label} variant="outline" className="h-12 justify-start gap-3 w-full" asChild>
                    <Link href={action.href}>
                      <action.icon className="h-5 w-5" />
                      {action.label}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="font-headline text-white">꿀팁 검증 안내</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm opacity-90 leading-relaxed">
                  유용해요를 많이 받은 글은 인기 꿀팁에 노출됩니다. 다만 더 이상 사용할 수 없는 정보는 신고와 검토 절차를 거쳐 인기 목록에서 제외됩니다.
                </p>

                <div className="mt-4 rounded-lg bg-white/10 p-3 text-sm">
                  <p className="font-semibold">검증 기준</p>
                  <p className="mt-1 opacity-90">
                    최근 검증일, 유용해요 수, 정보 변경 신고 수를 함께 반영합니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  검증 필요 / 내려간 글 목록
                </CardTitle>
                <CardDescription>
                  현재는 유효하지 않거나 변경 가능성이 높은 정보입니다.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {removedTips.map((tip, index) => (
                    <div key={index} className="rounded-xl border p-3 bg-muted/40">
                      <div className="flex items-start gap-3">
                        <ArchiveX className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium leading-relaxed">{tip.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {tip.reason} · 내려간 날짜 {tip.removedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  내려간 글 더보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
