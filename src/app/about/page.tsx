"use client"

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF6] text-[#102A1F]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#064420] hover:text-[#006B3F]"
        >
          <ArrowLeft className="h-4 w-4" />
          메인으로 돌아가기
        </Link>

        <section className="mt-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#064420]">
            Daegu Pulse 소개
          </h1>

          <p className="mt-5 text-xl text-[#476454]">
            대구대학교 학생들의 학교생활 정보를 연결하는 커뮤니티입니다.
          </p>
        </section>

        <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#064420]">
              서비스 목적
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-[#476454]">
              Daegu Pulse는 대구대학교 학생들이 학교생활에 필요한 정보를 더 쉽고 빠르게
              공유할 수 있도록 만든 공간입니다. 학생들은 수업, 장학, 시설, 공부공간,
              행정 절차와 관련된 꿀팁을 올리고, 다른 학생들은 이를 확인하고 검증할 수 있습니다.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#006B3F]" />
                <span className="font-semibold">학생 인증 기반 이용</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#006B3F]" />
                <span className="font-semibold">안전한 커뮤니티 운영</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#006B3F]" />
                <span className="font-semibold">실시간 캠퍼스 정보 공유</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#006B3F]" />
                <span className="font-semibold">학생 간 정보 공유</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#B7D7A8] bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#064420]">
              Daegu Pulse가 제공하는 기능
            </h3>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="font-bold text-[#064420]">학생 인증 기반 이용</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#476454]">
                  대구대학교 학생을 중심으로 운영되는 커뮤니티로, 학생들이 신뢰할 수 있는
                  정보를 주고받는 것을 목표로 합니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#064420]">안전한 커뮤니티 운영</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#476454]">
                  신고하기와 정보 갱신 요청 기능을 통해 부적절한 글이나 오래된 정보를 관리할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#064420]">실시간 캠퍼스 정보</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#476454]">
                  학생들이 작성한 최신 꿀팁을 확인하고, 유용해요·북마크·검증 기능으로 정보를 평가할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#064420]">학생 간 정보 공유</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#476454]">
                  개인이 알고 있던 학교생활 노하우를 다른 학생들과 나누며 더 나은 학교생활을 돕습니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
