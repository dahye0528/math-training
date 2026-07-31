"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

const CLASSES = ["1-1", "1-2", "2-1", "2-2", "2-3", "2-4"];

const CLASS_COLORS = [
  { bg: "from-pink-400 to-rose-400", shadow: "shadow-pink-200", light: "bg-pink-50", border: "border-pink-200" },
  { bg: "from-purple-400 to-violet-400", shadow: "shadow-purple-200", light: "bg-purple-50", border: "border-purple-200" },
  { bg: "from-blue-400 to-cyan-400", shadow: "shadow-blue-200", light: "bg-blue-50", border: "border-blue-200" },
  { bg: "from-emerald-400 to-teal-400", shadow: "shadow-emerald-200", light: "bg-emerald-50", border: "border-emerald-200" },
  { bg: "from-amber-400 to-orange-400", shadow: "shadow-amber-200", light: "bg-amber-50", border: "border-amber-200" },
  { bg: "from-indigo-400 to-blue-500", shadow: "shadow-indigo-200", light: "bg-indigo-50", border: "border-indigo-200" },
];

export default function StickersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 text-slate-700 font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-500">홈으로 가기</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col items-center">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
              칭찬 스티커 도장판
            </h1>
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-xl text-slate-500">반을 선택해 주세요!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
          {CLASSES.map((cls, i) => {
            const color = CLASS_COLORS[i];
            return (
              <Link
                key={cls}
                href={`/stickers/${cls}`}
                className={`group relative ${color.light} border-2 ${color.border} p-8 rounded-3xl shadow-xl ${color.shadow} flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden`}
              >
                {/* Decorative circle */}
                <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${color.bg} opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-white text-2xl font-extrabold">{cls}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-700">{cls}반</h2>
                <p className="text-sm text-slate-400 mt-1">학생 20명</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
