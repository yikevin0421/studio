"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Flag,
  RefreshCw,
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

type TipActionMenuProps = {
  isMine: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TipActionMenu({ isMine, onEdit, onDelete }: TipActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reasonType, setReasonType] = useState<"report" | "update" | null>(null);

  const handleReasonClick = (reason: string) => {
    alert(`선택한 사유: ${reason}`);
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
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
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
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
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
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                onClick={(event) => {
                  event.stopPropagation();
                  setReasonType(reasonType === "report" ? null : "report");
                }}
              >
                <Flag className="h-4 w-4" />
                신고하기
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                onClick={(event) => {
                  event.stopPropagation();
                  setReasonType(reasonType === "update" ? null : "update");
                }}
              >
                <RefreshCw className="h-4 w-4" />
                정보 갱신 요청
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
                  className="block w-full rounded-sm px-3 py-2 text-left text-xs hover:bg-accent"
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
