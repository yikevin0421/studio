"use client"

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Heart,
  Info,
  LogIn,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7FAF6] text-[#102A1F]">
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006B3F] text-white font-bold">
            D
          </div>
          <span className="text-lg font-bold text-[#064420]">Daegu Pulse</span>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about?from=home" className="flex items-center gap-1 text-[#365A45] hover:text-[#006B3F]">
            <Info className="h-4 w-4" />
            정보
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 rounded-md bg-[#006B3F] px-4 py-2 text-white "
          >
            <LogIn className="h-4 w-4" />
            로그인
          </Link>
        </nav>
      </header>

      <section className="grid min-h-[520px] grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:px-16">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-[#B7D7A8] bg-white px-3 py-1 text-sm text-[#006B3F]">
            대구대학교 학생 전용
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#064420] md:text-6xl">
              캠퍼스가 연결되는 곳.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-[#476454]">
              인증된 학생들이 참여하는 디지털 광장에 참여하세요.
              아이디어를 공유하고, 캠퍼스 소식을 듣고, 지식적인 우정을 쌓으세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-[#006B3F] px-5 py-3 text-sm font-medium text-white "
            >
              커뮤니티 가입하기
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/preview"
              className="inline-flex items-center rounded-md border border-[#B7D7A8] bg-white px-5 py-3 text-sm font-medium text-[#064420] hover:bg-[#EAF4E4]"
            >
              미리보기
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#B7D7A8] bg-white shadow-xl">
          <img
            src="/daegu-campus.png"
            alt="대구대학교 캠퍼스"
            className="h-[420px] w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:px-16">
        <h2 className="text-center text-2xl font-bold text-[#064420]">
          Built for Student Success
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#D7E8D0] bg-[#F7FAF6] p-6">
            <div className="mb-5 inline-flex rounded-lg bg-[#EAF4E4] p-3 text-[#006B3F]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#064420]">학생 전용 액세스</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#476454]">
              @daegu.ac.kr 이메일 계정으로 제한되어 신뢰할 수 있는 환경을 제공합니다.
            </p>
          </div>

          <div className="rounded-xl border border-[#D7E8D0] bg-[#F7FAF6] p-6">
            <div className="mb-5 inline-flex rounded-lg bg-[#EAF4E4] p-3 text-[#006B3F]">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#064420]">실시간 상호작용</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#476454]">
              동료들이 내 글에 반응할 때 즉시 알림을 받을 수 있습니다.
            </p>
          </div>

          <div className="rounded-xl border border-[#D7E8D0] bg-[#F7FAF6] p-6">
            <div className="mb-5 inline-flex rounded-lg bg-[#EAF4E4] p-3 text-[#006B3F]">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#064420]">AI 중재</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#476454]">
              지능형 가디언이 깨끗하고 존중하는 커뮤니티를 유지합니다.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#064420] px-6 py-8 text-white lg:px-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#006B3F] font-bold">
              D
            </div>
            <span className="font-bold">Daegu Pulse</span>
          </div>

          <p className="text-sm text-[#D7E8D0]">
            © 2026 Daegu Pulse. 학생 주도 비공식 이니셔티브입니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
