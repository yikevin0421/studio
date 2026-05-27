"use client"

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ThumbsUp,
  BookMarked,
  CheckCircle2,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

type TipEngagementActionsProps = {
  postId: string;
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

const defaultVerificationItems = [
  "2026.05.27 기준 학교 공지사항에서 관련 내용을 확인했습니다.",
  "최근에도 이용 가능하다는 제보가 있었습니다.",
  "링크 접속 및 안내 내용 확인이 완료되었습니다.",
  "현장 방문 후 정보가 맞는 것을 확인했습니다.",
  "담당 부서 안내와 일치하는 내용입니다.",
];

export function TipEngagementActions({
  postId,
  title,
  summary,
  category,
  useful,
  bookmarks,
  verified,
  createdAt,
  createdAtMs,
  lastVerified = "-",
  status = "현재 유효",
}: TipEngagementActionsProps) {
  const [usefulCount, setUsefulCount] = useState(useful);
  const [bookmarkCount, setBookmarkCount] = useState(bookmarks);
  const [verifiedCount, setVerifiedCount] = useState(verified);

  const [isUseful, setIsUseful] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verifyText, setVerifyText] = useState("");
  const [verificationItems, setVerificationItems] = useState<string[]>(defaultVerificationItems);
  const [showAllVerifications, setShowAllVerifications] = useState(false);

  const verificationStorageKey = `student-square-verifications-${postId}`;

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("student-square-bookmarks") ?? "[]"
    ) as BookmarkPost[];

    setIsBookmarked(savedBookmarks.some((post) => post.id === postId));

    const savedVerifications = JSON.parse(
      localStorage.getItem(verificationStorageKey) ?? "null"
    ) as string[] | null;

    if (savedVerifications) {
      setVerificationItems(savedVerifications);
    }
  }, [postId, verificationStorageKey]);

  const visibleVerificationItems = useMemo(() => {
    return showAllVerifications ? verificationItems : verificationItems.slice(0, 3);
  }, [showAllVerifications, verificationItems]);

  const handleUseful = () => {
    setIsUseful((prev) => {
      const next = !prev;
      setUsefulCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
      return next;
    });
  };

  const handleBookmark = () => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("student-square-bookmarks") ?? "[]"
    ) as BookmarkPost[];

    if (isBookmarked) {
      const nextBookmarks = savedBookmarks.filter((post) => post.id !== postId);
      localStorage.setItem("student-square-bookmarks", JSON.stringify(nextBookmarks));
      setBookmarkCount((count) => Math.max(0, count - 1));
      setIsBookmarked(false);
      return;
    }

    const newBookmark: BookmarkPost = {
      id: postId,
      title,
      summary,
      category,
      useful: usefulCount,
      bookmarks: bookmarkCount + 1,
      verified: verifiedCount,
      createdAt,
      createdAtMs,
      lastVerified,
      status,
    };

    const nextBookmarks = [
      newBookmark,
      ...savedBookmarks.filter((post) => post.id !== postId),
    ];

    localStorage.setItem("student-square-bookmarks", JSON.stringify(nextBookmarks));
    setBookmarkCount((count) => count + 1);
    setIsBookmarked(true);
  };

  const handleVerifyToggle = () => {
    if (isVerified) {
      setIsVerified(false);
      setIsVerifyOpen(false);
      setVerifyText("");
      setVerifiedCount((count) => Math.max(0, count - 1));
      return;
    }

    setIsVerified(true);
    setIsVerifyOpen(true);
    setVerifiedCount((count) => count + 1);
  };

  const handleSubmitVerification = () => {
    const trimmedText = verifyText.trim();
    if (!trimmedText) return;

    const nextItems = [trimmedText, ...verificationItems];
    setVerificationItems(nextItems);
    localStorage.setItem(verificationStorageKey, JSON.stringify(nextItems));
    setVerifyText("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Button variant={isUseful ? "secondary" : "ghost"} size="sm" onClick={handleUseful}>
          <ThumbsUp className="mr-1 h-4 w-4" />
          유용해요 {usefulCount}
        </Button>

        <Button variant={isBookmarked ? "secondary" : "ghost"} size="sm" onClick={handleBookmark}>
          <BookMarked className="mr-1 h-4 w-4" />
          북마크 {bookmarkCount}
        </Button>

        <Button variant={isVerified ? "secondary" : "ghost"} size="sm" onClick={handleVerifyToggle}>
          <CheckCircle2 className="mr-1 h-4 w-4" />
          검증 {verifiedCount}명
        </Button>

        <span className="flex items-center gap-1 px-2 py-1.5">
          <Clock3 className="h-4 w-4" />
          최근 검증일 {lastVerified}
        </span>
      </div>

      {isVerifyOpen && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex gap-2">
            <Input
              value={verifyText}
              onChange={(event) => setVerifyText(event.target.value)}
              placeholder="링크를 복사하거나 내용을 입력하세요"
            />

            <Button onClick={handleSubmitVerification} disabled={!verifyText.trim()}>
              제출
            </Button>
          </div>

          <div className="space-y-2">
            {visibleVerificationItems.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-md border bg-background px-3 py-2 text-sm">
                {item}
              </div>
            ))}

            {verificationItems.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 text-primary"
                onClick={() => setShowAllVerifications((prev) => !prev)}
              >
                {showAllVerifications ? (
                  <>
                    접기
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    더보기
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
