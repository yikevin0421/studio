"use client"

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const previewImages = [
  { src: "/feed-preview1.png.png", alt: "Daegu Pulse 미리보기 1" },
  { src: "/feed-preview2.png.png", alt: "Daegu Pulse 미리보기 2" },
];

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF6] px-6 py-8 text-[#102A1F]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#064420] hover:text-[#006B3F]"
      >
        <ArrowLeft className="h-4 w-4" />
        메인으로 돌아가기
      </Link>

      <section className="mx-auto mt-8 max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#064420]">
            미리보기
          </h1>
          <p className="mt-3 text-[#476454]">
            Daegu Pulse 화면을 미리 확인할 수 있습니다.
          </p>
        </div>

        <div className="space-y-6">
          {previewImages.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden rounded-3xl border border-[#B7D7A8] bg-white shadow-xl"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
