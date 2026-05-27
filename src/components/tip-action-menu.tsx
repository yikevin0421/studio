"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Flag,
  RefreshCw,
  Ban,
} from "lucide-react";

const reportReasons = [
  "게시판 성격에 부적절함",
  "욕설/비하",
  "음란물/불건전한 만남 및 대화",
  "상업적 광고 및 판매",
  "유출/사칭/사기",
  "낚시/놀람/도배",
  "정당/정치인 비하 및 선거운동",
  "불법촬영물 등의 유통",
];

const updateReasons = [
  "제도가 변경됨",
  "링크가 작동하지 않음",
  "현재는 신청 불가",
  "내용이 사실과 다름",
  "기타",
];

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

type TipActionMenuProps = {
  isMine: boolean;
  postId?: string;
  postTitle?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onBlock?: () => void;
};

function removeDuplicateRecords(records: RequestRecord[]) {
  const seen = new Set<string>();

  return records.filter((record) => {
    const key = `${record.type}-${record.postId ?? "unknown"}-${record.reason}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export function TipActionMenu({
  isMine,
  postId,
  postTitle,
  onEdit,
  onDelete,
  onBlock,
}: TipActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reasonType, setReasonType] = useState<"report" | "update" | null>(null);

  const handleReasonClick = (reason: string) => {
    if (!reasonType) return;

    const storageKey =
      reasonType === "report"
        ? "student-square-report-records"
        : "student-square-update-request-records";

    const savedRecords = JSON.parse(
      localStorage.getItem(storageKey) ?? "[]"
    ) as RequestRecord[];

    const alreadyExists = savedRecords.some(
      (record) =>
        record.type === reasonType &&
        record.postId === postId &&
        record.reason === reason
    );

    if (alreadyExists) {
      alert(
        reasonType === "report"
          ? "이미 같은 사유로 신고한 기록이 있습니다."
          : "이미 같은 사유로 정보 갱신을 요청한 기록이 있습니다."
      );

      setReasonType(null);
      setIsOpen(false);
      return;
    }

    const now = new Date();

    const newRecord: RequestRecord = {
      id: `${reasonType}-${Date.now()}`,
      postId,
      postTitle: postTitle ?? "제목 없음",
      reason,
      type: reasonType,
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

    const nextRecords = removeDuplicateRecords([newRecord, ...savedRecords]);

    localStorage.setItem(storageKey, JSON.stringify(nextRecords));
    window.dispatchEvent(new Event("student-square-request-records-updated"));

    alert(
      reasonType === "report"
        ? "신고가 저장되었습니다."
        : "정보 갱신 요청이 저장되었습니다."
    );

    setReasonType(null);
    setIsOpen(false);
  };

  const handleBlock = () => {
    if (postId) {
      const savedIds = JSON.parse(
        localStorage.getItem("student-square-hidden-posts") ?? "[]"
      ) as string[];

      const savedDetails = JSON.parse(
        localStorage.getItem("student-square-hidden-post-details") ?? "{}"
      ) as Record<string, string>;

      const nextIds = Array.from(new Set([...savedIds, postId]));
      const nextDetails = {
        ...savedDetails,
        [postId]: postTitle ?? postId,
      };

      localStorage.setItem("student-square-hidden-posts", JSON.stringify(nextIds));
      localStorage.setItem("student-square-hidden-post-details", JSON.stringify(nextDetails));
      window.dispatchEvent(new Event("student-square-hidden-posts-updated"));
    }

    onBlock?.();
    setReasonType(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(!isOpen);
          setReasonType(null);
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-30 w-48 rounded-md border bg-background p-1 shadow-md">
          {isMine ? (
            <>
              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit?.();
                  setIsOpen(false);
                }}
              >
                <Pencil className="h-4 w-4" />
                수정하기
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.();
                  setIsOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
                삭제하기
              </button>
            </>
          ) : (
            <>
              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  setReasonType(reasonType === "report" ? null : "report");
                }}
              >
                <Flag className="h-4 w-4" />
                신고하기
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  setReasonType(reasonType === "update" ? null : "update");
                }}
              >
                <RefreshCw className="h-4 w-4" />
                정보 갱신 요청
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  handleBlock();
                }}
              >
                <Ban className="h-4 w-4" />
                차단하기
              </button>
            </>
          )}

          {reasonType && (
            <div className="mt-1 border-t pt-1">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                사유를 선택해주세요.
              </p>

              {(reasonType === "report" ? reportReasons : updateReasons).map((reason) => (
                <button
                  key={reason}
                  className="block w-full rounded-sm px-3 py-2 text-left text-xs"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleReasonClick(reason);
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
