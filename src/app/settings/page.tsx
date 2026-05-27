"use client"

import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Ban,
  RotateCcw,
  Settings,
  ThumbsUp,
  CheckCircle2,
  Flag,
  RefreshCw,
} from "lucide-react";

type NotificationMode = "all" | "important" | "none";

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

type RequestRecord = {
  id: string;
  postId?: string;
  postTitle?: string;
  reason: string;
  type: "report" | "update";
  createdAt: string;
  createdAtMs: number;
  status: string;
};


function removeDuplicateRequestRecords(records: RequestRecord[]) {
  const seen = new Set<string>();

  return records.filter((record) => {
    const key = `${record.type}-${record.postId ?? "unknown"}-${record.reason}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

const notificationOptions: {
  value: NotificationMode;
  label: string;
  description: string;
}[] = [
  {
    value: "all",
    label: "모든 알림 받기",
    description: "새 꿀팁과 검증 답글 알림을 모두 표시합니다.",
  },
  {
    value: "important",
    label: "중요 알림만 받기",
    description: "내 검증에 달린 답글처럼 중요한 알림만 표시합니다.",
  },
  {
    value: "none",
    label: "알림 끄기",
    description: "오른쪽 상단에 알림을 표시하지 않습니다.",
  },
];

export default function SettingsPage() {
  const [notificationMode, setNotificationMode] = useState<NotificationMode>("all");
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);
  const [hiddenPostDetails, setHiddenPostDetails] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<SavedPost[]>([]);
  const [verifiedPosts, setVerifiedPosts] = useState<SavedPost[]>([]);
  const [reportRecords, setReportRecords] = useState<RequestRecord[]>([]);
  const [updateRequestRecords, setUpdateRequestRecords] = useState<RequestRecord[]>([]);

  const loadBlockedPosts = () => {
    const savedIds = JSON.parse(
      localStorage.getItem("student-square-hidden-posts") ?? "[]"
    ) as string[];

    const savedDetails = JSON.parse(
      localStorage.getItem("student-square-hidden-post-details") ?? "{}"
    ) as Record<string, string>;

    setHiddenPostIds(savedIds);
    setHiddenPostDetails(savedDetails);
  };

  const loadLikedPosts = () => {
    const savedLikedPosts = JSON.parse(
      localStorage.getItem("student-square-liked-posts") ?? "[]"
    ) as SavedPost[];

    setLikedPosts(savedLikedPosts);
  };

  const loadVerifiedPosts = () => {
    const savedVerifiedPosts = JSON.parse(
      localStorage.getItem("student-square-verified-posts") ?? "[]"
    ) as SavedPost[];

    setVerifiedPosts(savedVerifiedPosts);
  };

  const loadRequestRecords = () => {
    const savedReports = JSON.parse(
      localStorage.getItem("student-square-report-records") ?? "[]"
    ) as RequestRecord[];

    const savedUpdateRequests = JSON.parse(
      localStorage.getItem("student-square-update-request-records") ?? "[]"
    ) as RequestRecord[];

    const uniqueReports = removeDuplicateRequestRecords(savedReports);
    const uniqueUpdateRequests = removeDuplicateRequestRecords(savedUpdateRequests);

    localStorage.setItem("student-square-report-records", JSON.stringify(uniqueReports));
    localStorage.setItem("student-square-update-request-records", JSON.stringify(uniqueUpdateRequests));

    setReportRecords(uniqueReports);
    setUpdateRequestRecords(uniqueUpdateRequests);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("student-square-notification-mode") as NotificationMode | null;
    setNotificationMode(savedMode ?? "all");

    loadBlockedPosts();
    loadLikedPosts();
    loadVerifiedPosts();
    loadRequestRecords();

    const handleHiddenPostsUpdated = () => loadBlockedPosts();
    const handleLikedPostsUpdated = () => loadLikedPosts();
    const handleVerifiedPostsUpdated = () => loadVerifiedPosts();
    const handleRequestRecordsUpdated = () => loadRequestRecords();

    window.addEventListener("student-square-hidden-posts-updated", handleHiddenPostsUpdated);
    window.addEventListener("student-square-liked-posts-updated", handleLikedPostsUpdated);
    window.addEventListener("student-square-verified-posts-updated", handleVerifiedPostsUpdated);
    window.addEventListener("student-square-request-records-updated", handleRequestRecordsUpdated);
    window.addEventListener("storage", handleHiddenPostsUpdated);
    window.addEventListener("storage", handleLikedPostsUpdated);
    window.addEventListener("storage", handleVerifiedPostsUpdated);
    window.addEventListener("storage", handleRequestRecordsUpdated);

    return () => {
      window.removeEventListener("student-square-hidden-posts-updated", handleHiddenPostsUpdated);
      window.removeEventListener("student-square-liked-posts-updated", handleLikedPostsUpdated);
      window.removeEventListener("student-square-verified-posts-updated", handleVerifiedPostsUpdated);
      window.removeEventListener("student-square-request-records-updated", handleRequestRecordsUpdated);
      window.removeEventListener("storage", handleHiddenPostsUpdated);
      window.removeEventListener("storage", handleLikedPostsUpdated);
      window.removeEventListener("storage", handleVerifiedPostsUpdated);
      window.removeEventListener("storage", handleRequestRecordsUpdated);
    };
  }, []);

  const handleNotificationModeChange = (mode: NotificationMode) => {
    setNotificationMode(mode);
    localStorage.setItem("student-square-notification-mode", mode);
    window.dispatchEvent(new Event("student-square-notification-settings-updated"));
  };

  const handleUnblockPost = (postId: string) => {
    const nextIds = hiddenPostIds.filter((id) => id !== postId);
    const nextDetails = { ...hiddenPostDetails };

    delete nextDetails[postId];

    setHiddenPostIds(nextIds);
    setHiddenPostDetails(nextDetails);

    localStorage.setItem("student-square-hidden-posts", JSON.stringify(nextIds));
    localStorage.setItem("student-square-hidden-post-details", JSON.stringify(nextDetails));
    window.dispatchEvent(new Event("student-square-hidden-posts-updated"));
  };

  const handleUnlikePost = (postId: string) => {
    const nextLikedPosts = likedPosts.filter((post) => post.id !== postId);

    setLikedPosts(nextLikedPosts);
    localStorage.setItem("student-square-liked-posts", JSON.stringify(nextLikedPosts));
    window.dispatchEvent(new Event("student-square-liked-posts-updated"));
  };

  const handleDeleteRequestRecord = (type: "report" | "update", recordId: string) => {
    if (type === "report") {
      const nextRecords = reportRecords.filter((record) => record.id !== recordId);
      setReportRecords(nextRecords);
      localStorage.setItem("student-square-report-records", JSON.stringify(nextRecords));
    } else {
      const nextRecords = updateRequestRecords.filter((record) => record.id !== recordId);
      setUpdateRequestRecords(nextRecords);
      localStorage.setItem("student-square-update-request-records", JSON.stringify(nextRecords));
    }

    window.dispatchEvent(new Event("student-square-request-records-updated"));
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-7 w-7" />
            설정
          </h1>
          <p className="text-muted-foreground mt-2">
            알림, 신고 기록, 정보 갱신 요청, 차단한 게시글을 관리할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
            <CardDescription>
              오른쪽 상단에 표시할 알림 범위를 선택합니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {notificationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleNotificationModeChange(option.value)}
                className={`w-full rounded-xl border p-4 text-left ${
                  notificationMode === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              신고 기록
            </CardTitle>
            <CardDescription>
              내가 신고한 게시글과 신고 사유를 확인할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {reportRecords.length > 0 ? (
              <div className="space-y-3">
                {reportRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start justify-between gap-3 rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">{record.postTitle ?? "제목 없음"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        사유: {record.reason}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {record.createdAt} · {record.status}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRequestRecord("report", record.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                저장된 신고 기록이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              정보 갱신 요청 기록
            </CardTitle>
            <CardDescription>
              내가 정보 갱신을 요청한 게시글과 사유를 확인할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {updateRequestRecords.length > 0 ? (
              <div className="space-y-3">
                {updateRequestRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start justify-between gap-3 rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">{record.postTitle ?? "제목 없음"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        사유: {record.reason}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {record.createdAt} · {record.status}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRequestRecord("update", record.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                저장된 정보 갱신 요청이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              유용해요 누른 게시글
            </CardTitle>
            <CardDescription>
              내가 유용하다고 표시한 게시글을 모아볼 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {likedPosts.length > 0 ? (
              <div className="space-y-3">
                {likedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-3 rounded-xl border p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{post.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {post.summary}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {post.authorName ?? "꿀팁러 #0000"} · 유용해요 {post.useful}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleUnlikePost(post.id)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      해제
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                유용해요를 누른 게시글이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              검증에 작성한 게시글
            </CardTitle>
            <CardDescription>
              내가 검증을 작성한 게시글을 모아볼 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {verifiedPosts.length > 0 ? (
              <div className="space-y-3">
                {verifiedPosts.map((post) => (
                  <div key={post.id} className="rounded-xl border p-4">
                    <p className="font-medium">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {post.summary}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {post.authorName ?? "꿀팁러 #0000"} · 검증 {post.verified}명
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                검증을 작성한 게시글이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5" />
              차단한 게시글
            </CardTitle>
            <CardDescription>
              차단한 게시글은 메인 화면과 커뮤니티에 표시되지 않습니다.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {hiddenPostIds.length > 0 ? (
              <div className="space-y-3">
                {hiddenPostIds.map((postId) => (
                  <div
                    key={postId}
                    className="flex items-center justify-between gap-3 rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {hiddenPostDetails[postId] ?? postId}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        게시글 ID: {postId}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleUnblockPost(postId)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      차단 해제
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                차단한 게시글이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
