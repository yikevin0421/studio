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
  RotateCcw,
} from "lucide-react";
import { getOrCreateTipsterProfile } from "@/lib/tipster-profile";

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
  imageUrl?: string;
  authorName?: string;
  authorNumber?: number;
};

type VerificationRecord = {
  id: string;
  text: string;
  url?: string;
  authorName: string;
  authorNumber: number;
  createdAt: string;
};

type EngagementCounts = {
  useful: number;
  bookmarks: number;
  verified: number;
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
  imageUrl?: string;
  authorName?: string;
  authorNumber?: number;
  onCountsChange?: (counts: EngagementCounts) => void;
};

const defaultVerificationItems: VerificationRecord[] = [
  {
    id: "default-1",
    text: "2026.05.27 기준 학교 공지사항에서 관련 내용을 확인했습니다.",
    authorName: "꿀팁러 #1002",
    authorNumber: 1002,
    createdAt: "2026.05.27",
  },
  {
    id: "default-2",
    text: "최근에도 이용 가능하다는 제보가 있었습니다.",
    authorName: "꿀팁러 #1003",
    authorNumber: 1003,
    createdAt: "2026.05.27",
  },
  {
    id: "default-3",
    text: "링크 접속 및 안내 내용 확인이 완료되었습니다.",
    authorName: "꿀팁러 #1004",
    authorNumber: 1004,
    createdAt: "2026.05.27",
  },
  {
    id: "default-4",
    text: "현장 방문 후 정보가 맞는 것을 확인했습니다.",
    authorName: "꿀팁러 #1005",
    authorNumber: 1005,
    createdAt: "2026.05.27",
  },
];

function getSafeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    const lowerUrl = trimmed.toLowerCase();

    const blockedValues = [
      "javascript:",
      "data:",
      "file:",
      "chrome:",
      "vbscript:",
    ];

    if (blockedValues.some((blocked) => lowerUrl.startsWith(blocked))) {
      return null;
    }

    const blockedExtensions = [".exe", ".bat", ".cmd", ".scr", ".msi"];

    if (blockedExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function isLikelyUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function normalizeVerificationRecords(savedValue: string | null) {
  if (!savedValue) return defaultVerificationItems;

  try {
    const parsed = JSON.parse(savedValue) as Array<string | VerificationRecord>;

    return parsed.map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `legacy-${index}`,
          text: item,
          authorName: `꿀팁러 #${2000 + index}`,
          authorNumber: 2000 + index,
          createdAt: "2026.05.27",
        };
      }

      return item;
    });
  } catch {
    return defaultVerificationItems;
  }
}

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
  imageUrl,
  authorName,
  authorNumber,
  onCountsChange,
}: TipEngagementActionsProps) {
  const [baseVerifiedCount] = useState(verified);
  const [usefulCount, setUsefulCount] = useState(useful);
  const [bookmarkCount, setBookmarkCount] = useState(bookmarks);

  const [isUseful, setIsUseful] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verifyText, setVerifyText] = useState("");
  const [verificationItems, setVerificationItems] = useState<VerificationRecord[]>(defaultVerificationItems);
  const [showAllVerifications, setShowAllVerifications] = useState(false);
  const [validationError, setValidationError] = useState("");

  const myProfile = useMemo(() => getOrCreateTipsterProfile(), []);
  const verificationStorageKey = `student-square-verifications-${postId}`;

  const hasMyVerification = useMemo(() => {
    return verificationItems.some(
      (item) => item.authorNumber === myProfile.authorNumber
    );
  }, [verificationItems, myProfile.authorNumber]);

  const verifiedCount = baseVerifiedCount + (hasMyVerification ? 1 : 0);

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("student-square-bookmarks") ?? "[]"
    ) as BookmarkPost[];

    setIsBookmarked(savedBookmarks.some((post) => post.id === postId));

    const savedVerifications = localStorage.getItem(verificationStorageKey);
    setVerificationItems(normalizeVerificationRecords(savedVerifications));
  }, [postId, verificationStorageKey]);

  const visibleVerificationItems = useMemo(() => {
    return showAllVerifications ? verificationItems : verificationItems.slice(0, 3);
  }, [showAllVerifications, verificationItems]);

  const emitCounts = (nextCounts: EngagementCounts) => {
    onCountsChange?.(nextCounts);
  };

  const handleUseful = () => {
    const nextIsUseful = !isUseful;
    const nextUsefulCount = nextIsUseful
      ? usefulCount + 1
      : Math.max(0, usefulCount - 1);

    setIsUseful(nextIsUseful);
    setUsefulCount(nextUsefulCount);
    emitCounts({
      useful: nextUsefulCount,
      bookmarks: bookmarkCount,
      verified: verifiedCount,
    });
  };

  const handleBookmark = () => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("student-square-bookmarks") ?? "[]"
    ) as BookmarkPost[];

    if (isBookmarked) {
      const nextBookmarks = savedBookmarks.filter((post) => post.id !== postId);
      const nextBookmarkCount = Math.max(0, bookmarkCount - 1);

      localStorage.setItem("student-square-bookmarks", JSON.stringify(nextBookmarks));
      window.dispatchEvent(new Event("student-square-bookmarks-updated"));
      setBookmarkCount(nextBookmarkCount);
      setIsBookmarked(false);
      emitCounts({
        useful: usefulCount,
        bookmarks: nextBookmarkCount,
        verified: verifiedCount,
      });
      return;
    }

    const nextBookmarkCount = bookmarkCount + 1;

    const newBookmark: BookmarkPost = {
      id: postId,
      title,
      summary,
      category,
      useful: usefulCount,
      bookmarks: nextBookmarkCount,
      verified: verifiedCount,
      createdAt,
      createdAtMs,
      lastVerified,
      status,
      imageUrl,
      authorName,
      authorNumber,
    };

    const nextBookmarks = [
      newBookmark,
      ...savedBookmarks.filter((post) => post.id !== postId),
    ];

    localStorage.setItem("student-square-bookmarks", JSON.stringify(nextBookmarks));
    window.dispatchEvent(new Event("student-square-bookmarks-updated"));
    setBookmarkCount(nextBookmarkCount);
    setIsBookmarked(true);
    emitCounts({
      useful: usefulCount,
      bookmarks: nextBookmarkCount,
      verified: verifiedCount,
    });
  };

  const handleVerifyToggle = () => {
    setIsVerifyOpen((prev) => !prev);
  };

  const handleSubmitVerification = () => {
    const trimmedText = verifyText.trim();

    if (!trimmedText) return;

    if (isLikelyUrl(trimmedText) && !getSafeUrl(trimmedText)) {
      setValidationError("http:// 또는 https:// 링크만 입력할 수 있습니다.");
      return;
    }

    const safeUrl = getSafeUrl(trimmedText);

    const newRecord: VerificationRecord = {
      id: `verification-${Date.now()}`,
      text: safeUrl ? new URL(safeUrl).hostname : trimmedText,
      url: safeUrl ?? undefined,
      authorName: myProfile.authorName,
      authorNumber: myProfile.authorNumber,
      createdAt: new Date().toLocaleDateString("ko-KR"),
    };

    const hadMyVerification = verificationItems.some(
      (item) => item.authorNumber === myProfile.authorNumber
    );

    const nextItems = [newRecord, ...verificationItems];
    const nextHasMyVerification = true;
    const nextVerifiedCount = baseVerifiedCount + (nextHasMyVerification ? 1 : 0);

    setVerificationItems(nextItems);
    localStorage.setItem(verificationStorageKey, JSON.stringify(nextItems));
    setVerifyText("");
    setValidationError("");

    emitCounts({
      useful: usefulCount,
      bookmarks: bookmarkCount,
      verified: hadMyVerification ? verifiedCount : nextVerifiedCount,
    });
  };

  const handleWithdrawVerification = (verificationId: string) => {
    const nextItems = verificationItems.filter((item) => item.id !== verificationId);
    const stillHasMyVerification = nextItems.some(
      (item) => item.authorNumber === myProfile.authorNumber
    );
    const nextVerifiedCount = baseVerifiedCount + (stillHasMyVerification ? 1 : 0);

    setVerificationItems(nextItems);
    localStorage.setItem(verificationStorageKey, JSON.stringify(nextItems));

    emitCounts({
      useful: usefulCount,
      bookmarks: bookmarkCount,
      verified: nextVerifiedCount,
    });
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

        <Button variant={hasMyVerification ? "secondary" : "ghost"} size="sm" onClick={handleVerifyToggle}>
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
              onChange={(event) => {
                setVerifyText(event.target.value);
                setValidationError("");
              }}
              placeholder="링크를 복사하거나 내용을 입력하세요"
            />

            <Button onClick={handleSubmitVerification} disabled={!verifyText.trim()}>
              제출
            </Button>
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <div className="space-y-2">
            {visibleVerificationItems.map((item) => {
              const isMine = item.authorNumber === myProfile.authorNumber;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{item.authorName}</p>

                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-primary hover:underline"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="break-all text-muted-foreground">{item.text}</p>
                    )}

                    <p className="mt-1 text-xs text-muted-foreground">{item.createdAt}</p>
                  </div>

                  {isMine && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWithdrawVerification(item.id)}
                    >
                      <RotateCcw className="mr-1 h-4 w-4" />
                      회수
                    </Button>
                  )}
                </div>
              );
            })}

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
