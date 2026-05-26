"use client"

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Flame,
  Star,
  PlusCircle,
  BookMarked,
  ThumbsUp,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArchiveX,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const recentHotTips = [
    {
      title: '사범대 라운지에 전자레인지와 뜨거운 물 나오는 공간이 있습니다',
      category: '학교생활',
      useful: 128,
      verified: 32,
      lastVerified: '2026.05.26',
      status: '현재 유효',
      time: '2시간 전'
    },
    {
      title: '도서관 시험기간 24시간 운영 시기에는 3층 좌석이 비교적 여유롭습니다',
      category: '공부공간',
      useful: 96,
      verified: 21,
      lastVerified: '2026.05.25',
      status: '최근 검증됨',
      time: '5시간 전'
    },
    {
      title: '수강정정 기간에는 전공 사무실보다 학과 공지방을 먼저 확인하는 것이 빠릅니다',
      category: '수강신청',
      useful: 74,
      verified: 18,
      lastVerified: '2026.05.24',
      status: '현재 유효',
      time: '8시간 전'
    }
  ];

  const mostUsefulTips = [
    {
      title: '타대학 K-MOOC 원격강좌 학점인정은 매 학기 공지를 다시 확인해야 합니다',
      category: '학점인정',
      useful: 214,
      verified: 45,
      lastVerified: '2026.03.04',
      status: '갱신형 정보',
      note: '매 학기 확인 필요'
    },
    {
      title: '국가근로 신청 전 희망근로지 모집 여부를 먼저 확인하면 시간을 줄일 수 있습니다',
      category: '장학/근로',
      useful: 187,
      verified: 39,
      lastVerified: '2026.04.15',
      status: '최근 검증됨',
      note: '학기별 변동 가능'
    },
    {
      title: '프린트가 급할 때는 중앙도서관보다 학과 건물 복사기를 확인하는 것이 빠릅니다',
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
      label: language === 'en' ? 'Submit Tip' : '꿀팁 제보하기',
      icon: PlusCircle,
      href: '/community',
    },
    {
      label: language === 'en' ? 'Saved Tips' : '저장한 꿀팁',
      icon: BookMarked,
      href: '/bookmarks',
    },
    {
      label: language === 'en' ? 'Need Verification' : '검증 필요 글 보기',
      icon: RefreshCw,
      href: '/community',
    },
  ];

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
              {profile?.displayName ? `${profile.displayName}님` : '데모 사용자'}
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
                  최근 반응이 빠르게 늘어난 꿀팁입니다. 유용해요와 최근 검증 여부를 함께 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {recentHotTips.map((tip, index) => (
                    <div key={index} className="p-4 rounded-xl border hover:bg-accent transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <Star className="h-5 w-5 text-primary" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary">{tip.category}</Badge>
                              <Badge variant="outline">{tip.status}</Badge>
                            </div>

                            <h4 className="font-semibold group-hover:text-primary transition-colors leading-relaxed">
                              {tip.title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{tip.time}</span>
                              <span>•</span>
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
                          </div>
                        </div>

                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  {mostUsefulTips.map((tip, index) => (
                    <div key={index} className="p-4 rounded-xl border hover:bg-accent transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{tip.category}</Badge>
                          <Badge variant="outline">{tip.status}</Badge>
                        </div>

                        <h4 className="font-semibold leading-relaxed">{tip.title}</h4>

                        <p className="text-sm text-muted-foreground">
                          {tip.note}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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
                      </div>
                    </div>
                  ))}
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