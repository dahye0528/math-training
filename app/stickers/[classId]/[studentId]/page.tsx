"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Heart, Flame, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { use } from "react";

type StickerType = "presentation" | "character" | "study";

interface Sticker {
  id: string;
  sticker_type: StickerType;
  created_at: string;
}

interface PageProps {
  params: Promise<{ classId: string; studentId: string }>;
}

const STICKER_CONFIG = {
  presentation: {
    label: "발표",
    icon: Mic,
    color: "text-pink-500",
    bg: "bg-pink-100",
    border: "border-pink-300",
    gradient: "from-pink-400 to-rose-500",
    stamp: "bg-pink-500",
    shadow: "shadow-pink-300",
  },
  character: {
    label: "인성",
    icon: Heart,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    gradient: "from-emerald-400 to-teal-500",
    stamp: "bg-emerald-500",
    shadow: "shadow-emerald-300",
  },
  study: {
    label: "열공",
    icon: Flame,
    color: "text-blue-500",
    bg: "bg-blue-100",
    border: "border-blue-300",
    gradient: "from-blue-400 to-indigo-500",
    stamp: "bg-blue-500",
    shadow: "shadow-blue-300",
  },
};

const STAMP_POSITIONS = [
  { top: "10%", left: "5%", rotate: "-12deg", scale: 1 },
  { top: "8%", left: "25%", rotate: "8deg", scale: 0.9 },
  { top: "12%", left: "48%", rotate: "-5deg", scale: 1.05 },
  { top: "10%", left: "70%", rotate: "14deg", scale: 0.95 },
  { top: "10%", left: "85%", rotate: "-8deg", scale: 1 },
  { top: "35%", left: "8%", rotate: "10deg", scale: 0.9 },
  { top: "38%", left: "28%", rotate: "-15deg", scale: 1.1 },
  { top: "33%", left: "50%", rotate: "6deg", scale: 0.95 },
  { top: "37%", left: "72%", rotate: "-10deg", scale: 1 },
  { top: "36%", left: "88%", rotate: "12deg", scale: 0.9 },
  { top: "62%", left: "5%", rotate: "-7deg", scale: 1.05 },
  { top: "60%", left: "25%", rotate: "11deg", scale: 0.95 },
  { top: "64%", left: "47%", rotate: "-13deg", scale: 1 },
  { top: "61%", left: "68%", rotate: "7deg", scale: 1.1 },
  { top: "63%", left: "87%", rotate: "-9deg", scale: 0.9 },
  { top: "85%", left: "8%", rotate: "14deg", scale: 1 },
  { top: "83%", left: "30%", rotate: "-6deg", scale: 0.95 },
  { top: "87%", left: "52%", rotate: "9deg", scale: 1.05 },
  { top: "84%", left: "73%", rotate: "-11deg", scale: 0.9 },
  { top: "86%", left: "88%", rotate: "5deg", scale: 1 },
];

export default function StudentPage({ params }: PageProps) {
  const { classId, studentId } = use(params);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<StickerType | null>(null);

  const fetchStickers = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("stickers")
      .select("*")
      .eq("class_id", classId)
      .eq("student_id", parseInt(studentId))
      .order("created_at", { ascending: true });

    if (!error && data) {
      setStickers(data as Sticker[]);
    }
    setLoading(false);
  }, [classId, studentId]);

  useEffect(() => {
    fetchStickers();
  }, [fetchStickers]);

  const addSticker = async (type: StickerType) => {
    if (!supabase || adding) return;
    setAdding(type);

    // Optimistic update
    const optimisticSticker: Sticker = {
      id: `temp-${Date.now()}`,
      sticker_type: type,
      created_at: new Date().toISOString(),
    };
    setStickers((prev) => [...prev, optimisticSticker]);

    const { data, error } = await supabase.from("stickers").insert([
      { class_id: classId, student_id: parseInt(studentId), sticker_type: type },
    ]).select().single();

    if (!error && data) {
      setStickers((prev) => prev.map(s => s.id === optimisticSticker.id ? (data as Sticker) : s));
    } else {
      // Rollback on error
      setStickers((prev) => prev.filter(s => s.id !== optimisticSticker.id));
    }
    setAdding(null);
  };

  const counts = {
    presentation: stickers.filter(s => s.sticker_type === "presentation").length,
    character: stickers.filter(s => s.sticker_type === "character").length,
    study: stickers.filter(s => s.sticker_type === "study").length,
  };

  const total = stickers.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center gap-4 flex-wrap">
        <Link href={`/stickers/${classId}`} className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-500">{classId}반으로</span>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            {classId}반 {studentId}번 도장판
          </h1>
          {total > 0 && (
            <div className="bg-yellow-100 border-2 border-yellow-300 text-yellow-700 font-extrabold px-4 py-1 rounded-full text-lg">
              총 {total}개 🌟
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pb-8 flex flex-col gap-6">
        {/* Sticker Counts Summary */}
        <div className="grid grid-cols-3 gap-4">
          {(Object.keys(STICKER_CONFIG) as StickerType[]).map((type) => {
            const cfg = STICKER_CONFIG[type];
            const Icon = cfg.icon;
            return (
              <div key={type} className={`${cfg.bg} border-2 ${cfg.border} p-4 rounded-2xl flex items-center gap-3`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{cfg.label} 스티커</p>
                  <p className={`text-2xl font-extrabold ${cfg.color}`}>{counts[type]}개</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stamp Board */}
        <div className="bg-amber-50 border-4 border-amber-200 rounded-3xl shadow-inner relative overflow-hidden"
          style={{ minHeight: "380px" }}>
          {/* Board texture lines */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 29px, #d97706 30px), repeating-linear-gradient(90deg, transparent, transparent 29px, #d97706 30px)" }} />
          
          {/* Board label */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-xs font-bold px-4 py-1 rounded-full z-10">
            📋 {classId}반 {studentId}번 도장판
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full text-amber-400 text-lg font-bold pt-16">불러오는 중...</div>
          ) : stickers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-amber-400 pt-8">
              <span className="text-5xl mb-3">🎯</span>
              <p className="text-lg font-bold">아직 스티커가 없어요!</p>
              <p className="text-sm">아래 버튼으로 첫 도장을 찍어주세요 🎉</p>
            </div>
          ) : (
            <div className="relative w-full" style={{ minHeight: "360px", paddingTop: "40px" }}>
              {stickers.map((sticker, idx) => {
                const pos = STAMP_POSITIONS[idx % STAMP_POSITIONS.length];
                const cfg = STICKER_CONFIG[sticker.sticker_type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={sticker.id}
                    className={`absolute flex flex-col items-center transition-all duration-300 ${sticker.id.startsWith('temp') ? 'animate-bounce' : ''}`}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
                    }}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg ${cfg.shadow} border-4 border-white`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`mt-1 text-xs font-bold text-white ${cfg.stamp} px-2 py-0.5 rounded-full shadow`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Sticker Buttons */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <h2 className="text-center font-bold text-slate-600 mb-5 text-lg">도장 찍어주기! 💮</h2>
          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(STICKER_CONFIG) as StickerType[]).map((type) => {
              const cfg = STICKER_CONFIG[type];
              const Icon = cfg.icon;
              return (
                <button
                  key={type}
                  onClick={() => addSticker(type)}
                  disabled={adding !== null}
                  className={`group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${cfg.gradient} text-white shadow-lg ${cfg.shadow} hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    {adding === type ? (
                      <Plus className="w-7 h-7 animate-spin" />
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}
                  </div>
                  <span className="text-lg font-extrabold">{cfg.label}</span>
                  <span className="text-xs font-bold opacity-80">+ 도장 찍기</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
