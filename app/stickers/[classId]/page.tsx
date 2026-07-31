"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Heart, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { use } from "react";

interface StickerCounts {
  [studentId: number]: { presentation: number; character: number; study: number };
}

interface PageProps {
  params: Promise<{ classId: string }>;
}

export default function ClassPage({ params }: PageProps) {
  const { classId } = use(params);
  const [counts, setCounts] = useState<StickerCounts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("stickers")
        .select("student_id, sticker_type")
        .eq("class_id", classId);

      if (!error && data) {
        const newCounts: StickerCounts = {};
        for (let i = 1; i <= 20; i++) {
          newCounts[i] = { presentation: 0, character: 0, study: 0 };
        }
        data.forEach((row) => {
          if (newCounts[row.student_id]) {
            newCounts[row.student_id][row.sticker_type as keyof typeof newCounts[number]]++;
          }
        });
        setCounts(newCounts);
      }
      setLoading(false);
    };
    fetchCounts();
  }, [classId]);

  const totalFor = (id: number) => {
    const c = counts[id];
    if (!c) return 0;
    return c.presentation + c.character + c.study;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 text-slate-700 font-sans">
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center gap-4">
        <Link href="/stickers" className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-500">반 선택으로</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
          {classId}반 도장판
        </h1>
      </header>

      {/* Legend */}
      <div className="w-full max-w-5xl mx-auto px-6 mb-4 flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
          <Mic className="w-4 h-4 text-pink-500" /> <span className="text-sm font-bold text-slate-600">발표</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
          <Heart className="w-4 h-4 text-emerald-500" /> <span className="text-sm font-bold text-slate-600">인성</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
          <Flame className="w-4 h-4 text-blue-500" /> <span className="text-sm font-bold text-slate-600">열공</span>
        </div>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-8">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-400 text-xl">스티커 불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const c = counts[num] ?? { presentation: 0, character: 0, study: 0 };
              const total = c.presentation + c.character + c.study;
              return (
                <Link
                  key={num}
                  href={`/stickers/${classId}/${num}`}
                  className="group bg-white/90 backdrop-blur-md rounded-3xl shadow-lg shadow-blue-100/50 p-4 flex flex-col items-center hover:scale-105 active:scale-95 transition-all duration-200 border border-white"
                >
                  {/* Student number */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center mb-3 shadow-md">
                    <span className="text-white font-extrabold text-lg">{num}</span>
                  </div>
                  <span className="text-slate-600 font-bold text-sm mb-3">{num}번</span>

                  {/* Mini sticker counts */}
                  <div className="flex gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1 text-pink-500">
                      <Mic className="w-3 h-3" />{c.presentation}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-500">
                      <Heart className="w-3 h-3" />{c.character}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500">
                      <Flame className="w-3 h-3" />{c.study}
                    </span>
                  </div>

                  {/* Total badge */}
                  {total > 0 && (
                    <div className="mt-2 bg-yellow-100 text-yellow-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                      총 {total}개
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
