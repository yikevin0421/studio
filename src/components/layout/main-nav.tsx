"use client"

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationMode = "all" | "important" | "none";

type NotificationItem = {
  id: string;
  type: "new-tip" | "reply";
  title: string;
  description: string;
  time: string;
  unread?: boolean;
};

const defaultNotifications: NotificationItem[] = [
  {
    id: "notice-001",
    type: "new-tip",
    title: "새로운 꿀팁이 올라왔습니다",
    description: "최근 뜨는 꿀팁에 새 게시글이 추가되었습니다.",
    time: "방금 전",
    unread: true,
  },
  {
    id: "notice-002",
    type: "reply",
    title: "내 검증에 새 대댓글이 달렸습니다",
    description: "다른 사용자가 내가 작성한 검증에 답글을 남겼습니다.",
    time: "5분 전",
    unread: true,
  },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationMode, setNotificationMode] = useState<NotificationMode>("all");
  const [notifications, setNotifications] = useState(defaultNotifications);

  useEffect(() => {
    const loadNotificationMode = () => {
      const savedMode = localStorage.getItem("student-square-notification-mode") as NotificationMode | null;
      setNotificationMode(savedMode ?? "all");
    };

    loadNotificationMode();

    window.addEventListener("storage", loadNotificationMode);
    window.addEventListener("student-square-notification-settings-updated", loadNotificationMode);

    return () => {
      window.removeEventListener("storage", loadNotificationMode);
      window.removeEventListener("student-square-notification-settings-updated", loadNotificationMode);
    };
  }, []);

  const visibleNotifications = useMemo(() => {
    if (notificationMode === "none") return [];
    if (notificationMode === "important") {
      return notifications.filter((notification) => notification.type === "reply");
    }

    return notifications;
  }, [notificationMode, notifications]);

  const unreadCount = useMemo(() => {
    return visibleNotifications.filter((notification) => notification.unread).length;
  }, [visibleNotifications]);

  const handleOpenNotifications = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          unread: false,
        }))
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="text-lg font-bold text-primary">
          Daegu Pulse
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={handleOpenNotifications}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isOpen && (
              <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border bg-background p-2 shadow-lg">
                <div className="border-b px-3 py-2">
                  <p className="font-semibold">알림</p>
                  <p className="text-xs text-muted-foreground">
                    새 꿀팁과 검증 답글을 확인할 수 있습니다.
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto py-2">
                  {visibleNotifications.length > 0 ? (
                    visibleNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-lg px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      표시할 알림이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
