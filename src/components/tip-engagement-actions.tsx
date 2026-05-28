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
  MessageCircle,
  Send,
  MoreHorizontal,
  Flag,
  BellOff,
  Ban,
} from "lucide-react";
import { getOrCreateTipsterProfile } from "@/lib/tipster-profile";

type SavedPost = {
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

type VerificationReply = {
  id: string;
  text: string;
  authorName: string;
  authorNumber: number;
  createdAt: string;
  createdAtMs: number;
};

type VerificationRecord = {
  id: string;
  text: string;
  url?: string;
  authorName: string;
  authorNumber: number;
  createdAt: string;
  createdAtMs: number;
  replies?: VerificationReply[];
  withdrawn?: boolean;
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
    createdAtMs: 1779807600000,
    replies: [
      {
        id: "reply-default-1",
        text: "저도 같은 내용 확인했습니다.",
        authorName: "꿀팁러 #1008",
        authorNumber: 1008,
        createdAt: "2026.05.27",
        createdAtMs: 1779807800000,
      },
    ],
  },
  {
    id: "default-2",
    text: "최근에도 이용 가능하다는 제보가 있었습니다.",
    authorName: "꿀팁러 #1003",
    authorNumber: 1003,
    createdAt: "2026.05.27",
    createdAtMs: 1779807400000,
    replies: [],
  },
  {
    id: "default-3",
    text: "링크 접속 및 안내 내용 확인이 완료되었습니다.",
    authorName: "꿀팁러 #1004",
    authorNumber: 1004,
    createdAt: "2026.05.27",
    createdAtMs: 1779807200000,
    replies: [],
  },
  {
    id: "default-4",
    text: "현장 방문 후 정보가 맞는 것을 확인했습니다.",
    authorName: "꿀팁러 #1005",
    authorNumber: 1005,
    createdAt: "2026.05.27",
    createdAtMs: 1779807000000,
    replies: [],
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
    const blockedValues = ["javascript:", "data:", "file:", "chrome:", "vbscript:"];

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
          createdAtMs: 1779806000000 + index,
          replies: [],
        };
      }

      return {
        ...item,
        createdAtMs: item.createdAtMs ?? 1779806000000,
        replies: item.replies ?? [],
      };
    });
  } catch {
    return defaultVerificationItems;
  }
}

function getUniqueVerifierCount(records: VerificationRecord[]) {
  const dynamicRecords = records.filter(
    (record) =>
      !record.withdrawn &&
      !record.id.startsWith("default-") &&
      !record.id.startsWith("legacy-")
  );

  return new Set(dynamicRecords.map((record) => record.authorNumber)).size;
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
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [openReplyMenuId, setOpenReplyMenuId] = useState<string | null>(null);
  const [blockedReplyAuthors, setBlockedReplyAuthors] = useState<number[]>([]);
  const [mutedReplyIds, setMutedReplyIds] = useState<string[]>([]);

  const myProfile = useMemo(() => getOrCreateTipsterProfile(), []);
  const verificationStorageKey = `student-square-verifications-${postId}`;
  const blockedReplyAuthorsKey = `student-square-blocked-reply-authors-${postId}`;
  const mutedReplyIdsKey = `student-square-muted-replies-${postId}`;

  const sortedVerificationItems = useMemo(() => {
    return [...verificationItems].sort((a, b) => {
      const aIsMine = a.authorNumber === myProfile.authorNumber;
      const bIsMine = b.authorNumber === myProfile.authorNumber;

      if (aIsMine && !bIsMine) return -1;
      if (!aIsMine && bIsMine) return 1;

      return b.createdAtMs - a.createdAtMs;
    });
  }, [verificationItems, myProfile.authorNumber]);

  const verifiedCount = useMemo(() => {
    return baseVerifiedCount + getUniqueVerifierCount(verificationItems);
  }, [baseVerifiedCount, verificationItems]);

  const hasMyVerification = useMemo(() => {
    return verificationItems.some(
      (item) => item.authorNumber === myProfile.authorNumber && !item.withdrawn
    );
  }, [verificationItems, myProfile.authorNumber]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("student-square-bookmarks") ?? "[]"
    ) as SavedPost[];

    const savedLikedPosts = JSON.parse(
      localStorage.getItem("student-square-liked-posts") ?? "[]"
    ) as SavedPost[];

    setIsBookmarked(savedBookmarks.some((post) => post.id === postId));
    setIsUseful(savedLikedPosts.some((post) => post.id === postId));

    const savedVerifications = localStorage.getItem(verificationStorageKey);
    setVerificationItems(normalizeVerificationRecords(savedVerifications));

    const savedBlockedReplyAuthors = JSON.parse(
      localStorage.getItem(blockedReplyAuthorsKey) ?? "[]"
    ) as number[];

    const savedMutedReplyIds = JSON.parse(
      localStorage.getItem(mutedReplyIdsKey) ?? "[]"
    ) as string[];

    setBlockedReplyAuthors(savedBlockedReplyAuthors);
    setMutedReplyIds(savedMutedReplyIds);
  }, [postId, verificationStorageKey, blockedReplyAuthorsKey, mutedReplyIdsKey]);

  const visibleVerificationItems = useMemo(() => {
    return showAllVerifications
      ? sortedVerificationItems
      : sortedVerificationItems.slice(0, 3);
  }, [showAllVerifications, sortedVerificationItems]);

  const emitCounts = (nextCounts: EngagementCounts) => {
    onCountsChange?.(nextCounts);
  };

  const saveVerificationItems = (records: VerificationRecord[]) => {
    setVerificationItems(records);
    localStorage.setItem(verificationStorageKey, JSON.stringify(records));
  };

  const saveVerifiedPost = (count: number) => {
    const savedVerifiedPosts = JSON.parse(
      localStorage.getItem("student-square-verified-posts") ?? "[]"
    ) as SavedPost[];

    const newVerifiedPost: SavedPost = {
      id: postId,
      title,
      summary,
      category,
      useful: usefulCount,
      bookmarks: bookmarkCount,
      verified: count,
      createdAt,
      createdAtMs,
      lastVerified,
      status,
      imageUrl,
      authorName,
      authorNumber,
    };

    const nextVerifiedPosts = [
      newVerifiedPost,
      ...savedVerifiedPosts.filter((post) => post.id !== postId),
    ];

    localStorage.setItem("student-square-verified-posts", JSON.stringify(nextVerifiedPosts));
    window.dispatchEvent(new Event("student-square-verified-posts-updated"));
  };

  const removeVerifiedPost = () => {
    const savedVerifiedPosts = JSON.parse(
      localStorage.getItem("student-square-verified-posts") ?? "[]"
    ) as SavedPost[];

    const nextVerifiedPosts = savedVerifiedPosts.filter((post) => post.id !== postId);

    localStorage.setItem("student-square-verified-posts", JSON.stringify(nextVerifiedPosts));
    window.dispatchEvent(new Event("student-square-verified-posts-updated"));
  };

  const handleUseful = () => {
    const savedLikedPosts = JSON.parse(
      localStorage.getItem("student-square-liked-posts") ?? "[]"
    ) as SavedPost[];

    if (isUseful) {
      const nextLikedPosts = savedLikedPosts.filter((post) => post.id !== postId);
      const nextUsefulCount = Math.max(0, usefulCount - 1);

      localStorage.setItem("student-square-liked-posts", JSON.stringify(nextLikedPosts));
      window.dispatchEvent(new Event("student-square-liked-posts-updated"));
      setIsUseful(false);
      setUsefulCount(nextUsefulCount);

      emitCounts({
        useful: nextUsefulCount,
        bookmarks: bookmarkCount,
        verified: verifiedCount,
      });

      return;
    }

    const nextUsefulCount = usefulCount + 1;

    const newLikedPost: SavedPost = {
      id: postId,
      title,
      summary,
      category,
      useful: nextUsefulCount,
      bookmarks: bookmarkCount,
      verified: verifiedCount,
      createdAt,
      createdAtMs,
      lastVerified,
      status,
      imageUrl,
      authorName,
      authorNumber,
    };

    const nextLikedPosts = [
      newLikedPost,
      ...savedLikedPosts.filter((post) => post.id !== postId),
    ];

    localStorage.setItem("student-square-liked-posts", JSON.stringify(nextLikedPosts));
    window.dispatchEvent(new Event("student-square-liked-posts-updated"));
    setIsUseful(true);
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
    ) as SavedPost[];

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

    const newBookmark: SavedPost = {
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
    const now = new Date();

    const newRecord: VerificationRecord = {
      id: `verification-${Date.now()}`,
      text: safeUrl ? new URL(safeUrl).hostname : trimmedText,
      url: safeUrl ?? undefined,
      authorName: myProfile.authorName,
      authorNumber: myProfile.authorNumber,
      createdAt: now.toLocaleDateString("ko-KR"),
      createdAtMs: now.getTime(),
      replies: [],
    };

    const nextItems = [newRecord, ...verificationItems];
    const nextVerifiedCount = baseVerifiedCount + getUniqueVerifierCount(nextItems);

    saveVerificationItems(nextItems);
    saveVerifiedPost(nextVerifiedCount);
    setVerifyText("");
    setValidationError("");

    emitCounts({
      useful: usefulCount,
      bookmarks: bookmarkCount,
      verified: nextVerifiedCount,
    });
  };

  const handleWithdrawVerification = (verificationId: string) => {
    const targetItem = verificationItems.find((item) => item.id === verificationId);
    const hasReplies = Boolean(targetItem?.replies?.length);

    const nextItems = hasReplies
      ? verificationItems.map((item) =>
          item.id === verificationId
            ? {
                ...item,
                text: "회수된 글입니다",
                url: undefined,
                withdrawn: true,
              }
            : item
        )
      : verificationItems.filter((item) => item.id !== verificationId);

    const nextVerifiedCount = baseVerifiedCount + getUniqueVerifierCount(nextItems);
    const stillHasMyVerification = nextItems.some(
      (item) => item.authorNumber === myProfile.authorNumber && !item.withdrawn
    );

    saveVerificationItems(nextItems);

    if (stillHasMyVerification) {
      saveVerifiedPost(nextVerifiedCount);
    } else {
      removeVerifiedPost();
    }

    emitCounts({
      useful: usefulCount,
      bookmarks: bookmarkCount,
      verified: nextVerifiedCount,
    });
  };

  const handleSubmitReply = (verificationId: string) => {
    const trimmedReply = replyText.trim();

    if (!trimmedReply) return;

    const now = new Date();

    const newReply: VerificationReply = {
      id: `reply-${Date.now()}`,
      text: trimmedReply,
      authorName: myProfile.authorName,
      authorNumber: myProfile.authorNumber,
      createdAt: now.toLocaleDateString("ko-KR"),
      createdAtMs: now.getTime(),
    };

    const nextItems = verificationItems.map((item) =>
      item.id === verificationId
        ? {
            ...item,
            replies: [...(item.replies ?? []), newReply],
          }
        : item
    );

    saveVerificationItems(nextItems);
    setReplyTargetId(null);
    setReplyText("");
  };

  const handleMuteReplyNotification = (replyId: string) => {
    const nextMutedReplyIds = Array.from(new Set([...mutedReplyIds, replyId]));
    setMutedReplyIds(nextMutedReplyIds);
    localStorage.setItem(mutedReplyIdsKey, JSON.stringify(nextMutedReplyIds));
    setOpenReplyMenuId(null);
  };

  const handleBlockReplyAuthor = (replyAuthorNumber: number) => {
    const nextBlockedAuthors = Array.from(new Set([...blockedReplyAuthors, replyAuthorNumber]));
    setBlockedReplyAuthors(nextBlockedAuthors);
    localStorage.setItem(blockedReplyAuthorsKey, JSON.stringify(nextBlockedAuthors));
    setOpenReplyMenuId(null);
  };

  const handleReportReply = (reply: VerificationReply) => {
    const storageKey = "student-square-report-records";

    const savedRecords = JSON.parse(
      localStorage.getItem(storageKey) ?? "[]"
    ) as Array<{
      id: string;
      postId?: string;
      postTitle?: string;
      reason: string;
      type: "report" | "update";
      createdAt: string;
      createdAtMs: number;
      status: string;
    }>;

    const reason = `검증 답글 신고: ${reply.authorName}`;

    const alreadyExists = savedRecords.some(
      (record) =>
        record.type === "report" &&
        record.postId === postId &&
        record.reason === reason
    );

    if (alreadyExists) {
      alert("이미 해당 검증 답글을 신고했습니다.");
      setOpenReplyMenuId(null);
      return;
    }

    const now = new Date();

    const newRecord = {
      id: `reply-report-${Date.now()}`,
      postId,
      postTitle: `${title} - 검증 답글`,
      reason,
      type: "report" as const,
      createdAt: now.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAtMs: now.getTime(),
      status: "접수됨",
    };

    localStorage.setItem(storageKey, JSON.stringify([newRecord, ...savedRecords]));
    window.dispatchEvent(new Event("student-square-request-records-updated"));

    alert("검증 답글 신고가 저장되었습니다.");
    setOpenReplyMenuId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseful}
          className={
            isUseful
              ? "border-black bg-black text-white"
              : "border-black bg-white text-black"
          }
        >
          <ThumbsUp className="mr-1 h-4 w-4" />
          유용해요 {usefulCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleBookmark}
          className={
            isBookmarked
              ? "border-black bg-black text-white"
              : "border-black bg-white text-black"
          }
        >
          <BookMarked className="mr-1 h-4 w-4" />
          북마크 {bookmarkCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleVerifyToggle}
          className={
            hasMyVerification
              ? "border-black bg-black text-white"
              : "border-black bg-white text-black"
          }
        >
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
              const replies = (item.replies ?? [])
                .filter((reply) => !blockedReplyAuthors.includes(reply.authorNumber))
                .sort((a, b) => b.createdAtMs - a.createdAtMs);

              return (
                <div
                  key={item.id}
                  className="space-y-3 rounded-md border bg-background px-3 py-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{item.authorName}</p>

                      {item.withdrawn ? (
                        <p className="break-all text-muted-foreground">
                          회수된 글입니다
                        </p>
                      ) : item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-primary underline-offset-4"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <p className="break-all text-muted-foreground">{item.text}</p>
                      )}

                      <p className="mt-1 text-xs text-muted-foreground">{item.createdAt}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setReplyTargetId(replyTargetId === item.id ? null : item.id)
                        }
                      >
                        <MessageCircle className="mr-1 h-4 w-4" />
                        답글
                      </Button>

                      {isMine && !item.withdrawn && (
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
                  </div>

                  {replyTargetId === item.id && (
                    <div className="flex gap-2 border-t pt-3">
                      <Input
                        value={replyText}
                        onChange={(event) => setReplyText(event.target.value)}
                        placeholder="대댓글을 입력하세요"
                      />

                      <Button
                        onClick={() => handleSubmitReply(item.id)}
                        disabled={!replyText.trim()}
                      >
                        <Send className="mr-1 h-4 w-4" />
                        등록
                      </Button>
                    </div>
                  )}

                  {replies.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                      {replies.map((reply) => {
                        const isReplyMenuOpen = openReplyMenuId === reply.id;
                        const isMuted = mutedReplyIds.includes(reply.id);

                        return (
                          <div
                            key={reply.id}
                            className="relative rounded-md bg-muted/60 px-3 py-2 pr-10"
                          >
                            <p className="text-xs font-medium">
                              {reply.authorName}
                              {isMuted && (
                                <span className="ml-2 text-muted-foreground">
                                  알림 꺼짐
                                </span>
                              )}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {reply.text}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {reply.createdAt}
                            </p>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-7 w-7"
                              onClick={() =>
                                setOpenReplyMenuId(isReplyMenuOpen ? null : reply.id)
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>

                            {isReplyMenuOpen && (
                              <div className="absolute right-1 top-9 z-30 w-44 rounded-md border bg-background p-1 shadow-md">
                                <button
                                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                                  onClick={() => handleMuteReplyNotification(reply.id)}
                                >
                                  <BellOff className="h-4 w-4" />
                                  답글 알림 끄기
                                </button>

                                <button
                                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                                  onClick={() => handleReportReply(reply)}
                                >
                                  <Flag className="h-4 w-4" />
                                  신고하기
                                </button>

                                <button
                                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                                  onClick={() => handleBlockReplyAuthor(reply.authorNumber)}
                                >
                                  <Ban className="h-4 w-4" />
                                  차단하기
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
