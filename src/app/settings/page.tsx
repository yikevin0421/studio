"use client"

import { useState } from "react";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Settings } from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      alert("설정이 저장되었습니다.");
    }, 700);
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
            계정과 서비스 이용 환경을 관리할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기본 설정</CardTitle>
            <CardDescription>
              현재는 기본 화면 설정만 제공합니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              저장
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
