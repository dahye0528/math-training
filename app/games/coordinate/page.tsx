"use client";

import { useState, useEffect } from "react";
import { Compass, Trophy, Star, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Phase = "intro" | "phase1" | "phase2" | "result" | "ranking";

interface Point {
  x: number;
  y: number;
}

export default function CoordinateGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [targetPoint, setTargetPoint] = useState<Point>({ x: 0, y: 0 });
  const [userX, setUserX] = useState("");
  const [userY, setUserY] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [studentName, setStudentName] = useState("");
  const [rankings, setRankings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_QUESTIONS_PER_PHASE = 5;

  const generateRandomPoint = () => {
    // Generate between -5 and 5
    const x = Math.floor(Math.random() * 11) - 5;
    const y = Math.floor(Math.random() * 11) - 5;
    return { x, y };
  };

  const startGame = () => {
    setScore(0);
    setCurrentQuestion(1);
    setTargetPoint(generateRandomPoint());
    setPhase("phase1");
  };

  const handlePhase1Submit = () => {
    if (parseInt(userX) === targetPoint.x && parseInt(userY) === targetPoint.y) {
      setScore((s) => s + 10);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      setUserX("");
      setUserY("");
      if (currentQuestion < TOTAL_QUESTIONS_PER_PHASE) {
        setCurrentQuestion((q) => q + 1);
        setTargetPoint(generateRandomPoint());
      } else {
        setCurrentQuestion(1);
        setTargetPoint(generateRandomPoint());
        setPhase("phase2");
      }
    }, 1500);
  };

  const handleGridClick = (clickedX: number, clickedY: number) => {
    if (phase !== "phase2" || feedback !== null) return;

    if (clickedX === targetPoint.x && clickedY === targetPoint.y) {
      setScore((s) => s + 10);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < TOTAL_QUESTIONS_PER_PHASE) {
        setCurrentQuestion((q) => q + 1);
        setTargetPoint(generateRandomPoint());
      } else {
        setPhase("result");
      }
    }, 1500);
  };

  const submitScore = async () => {
    if (!studentName.trim() || !supabase) return;
    setIsSubmitting(true);
    
    try {
      await supabase.from("coordinate_game_rankings").insert([
        { student_name: studentName, score: score }
      ]);
      fetchRankings();
    } catch (error) {
      console.error("Error submitting score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRankings = async () => {
    setPhase("ranking");
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("coordinate_game_rankings")
      .select("*")
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10);
      
    if (!error && data) {
      setRankings(data);
    }
  };

  // Helper to render the grid with proper intersections
  const renderGrid = (interactive: boolean) => {
    const MIN = -5;
    const MAX = 5;
    const range = MAX - MIN;

    const getLeftPercent = (x: number) => ((x - MIN) / range) * 100;
    const getTopPercent = (y: number) => (1 - ((y - MIN) / range)) * 100;

    const lines = [];
    const intersections = [];

    // Draw lines
    for (let i = MIN; i <= MAX; i++) {
      const posPercent = getLeftPercent(i);
      
      // Vertical line (x = i)
      lines.push(
        <div 
          key={`v-${i}`} 
          className={`absolute top-0 bottom-0 ${i === 0 ? 'bg-slate-800 w-[2px] z-10 -ml-[1px]' : 'bg-slate-200 w-[1px]'}`}
          style={{ left: `${posPercent}%` }}
        >
          {i !== 0 && <span className="absolute -bottom-6 -ml-2 text-xs font-medium text-slate-500">{i}</span>}
          {i === 0 && <span className="absolute -bottom-6 ml-2 text-xs font-bold text-slate-800">x축</span>}
        </div>
      );
      
      // Horizontal line (y = i)
      lines.push(
        <div 
          key={`h-${i}`} 
          className={`absolute left-0 right-0 ${i === 0 ? 'bg-slate-800 h-[2px] z-10 -mt-[1px]' : 'bg-slate-200 h-[1px]'}`}
          style={{ top: `${getTopPercent(i)}%` }}
        >
          {i !== 0 && <span className="absolute -left-6 -mt-2 text-xs font-medium text-slate-500">{i}</span>}
          {i === 0 && <span className="absolute -top-6 ml-2 text-xs font-bold text-slate-800">y축</span>}
        </div>
      );
    }

    // Draw clickable intersections
    for (let x = MIN; x <= MAX; x++) {
      for (let y = MIN; y <= MAX; y++) {
        const isTarget = phase === "phase1" && targetPoint.x === x && targetPoint.y === y;
        const isFeedback = phase === "phase2" && feedback === "incorrect" && targetPoint.x === x && targetPoint.y === y;
        
        intersections.push(
          <div
            key={`p-${x}-${y}`}
            onClick={() => interactive && handleGridClick(x, y)}
            className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center z-20 ${interactive ? 'cursor-pointer hover:bg-pink-400/30' : ''}`}
            style={{ left: `${getLeftPercent(x)}%`, top: `${getTopPercent(y)}%` }}
          >
            {isTarget && (
              <div className="w-5 h-5 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50 animate-bounce" />
            )}
            {isFeedback && (
              <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-ping" />
            )}
            {/* Show point in phase 2 if correct */}
            {phase === "phase2" && feedback === "correct" && targetPoint.x === x && targetPoint.y === y && (
              <div className="w-5 h-5 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50" />
            )}
          </div>
        );
      }
    }

    return (
      <div className="relative w-full max-w-[400px] aspect-square bg-white rounded-xl shadow-xl shadow-blue-100/50 my-10 border border-slate-100">
        <div className="absolute inset-10">
           {lines}
           {intersections}
           {/* Origin label */}
           <span className="absolute ml-2 mt-2 text-xs font-bold text-slate-800 z-30" style={{ left: '50%', top: '50%' }}>0</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 text-slate-700 font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform">
          <Compass className="w-6 h-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-500">홈으로 가기</span>
        </Link>
        {phase !== "intro" && phase !== "ranking" && (
          <div className="bg-white/90 px-6 py-2 rounded-full shadow-md font-bold text-xl text-blue-500">
            점수: {score} / 100
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center py-8">
        
        {phase === "intro" && (
          <div className="bg-white/90 p-10 rounded-3xl shadow-2xl shadow-pink-200/50 max-w-2xl w-full jelly-bounce">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-6">
              보물 좌표 찾기 게임! 🗺️
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              중학교 1학년 수학: 좌표평면과 그래프 단원
            </p>
            <ul className="text-left bg-slate-50 p-6 rounded-2xl mb-8 space-y-3">
              <li>📍 <strong>1단계:</strong> 찍혀있는 점을 보고 (x, y) 좌표를 맞춰보세요! (5문제)</li>
              <li>🎯 <strong>2단계:</strong> 주어진 (x, y) 좌표를 보고 정확한 위치를 클릭하세요! (5문제)</li>
            </ul>
            <button 
              onClick={startGame}
              className="px-10 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full text-2xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-pink-300"
            >
              게임 시작하기!
            </button>
          </div>
        )}

        {phase === "phase1" && (
          <div className="flex flex-col items-center w-full">
            <div className="bg-white/80 px-6 py-2 rounded-full text-pink-500 font-bold mb-4 shadow-sm">
              1단계: 점의 좌표 읽기 ({currentQuestion}/5)
            </div>
            <h2 className="text-3xl font-bold mb-2">반짝이는 보물의 좌표는 어디일까요?</h2>
            
            {renderGrid(false)}

            <div className="flex items-center gap-4 text-2xl font-bold bg-white p-6 rounded-full shadow-lg">
              <span>(</span>
              <input 
                type="number" 
                value={userX} 
                onChange={(e) => setUserX(e.target.value)}
                className="w-16 text-center border-b-4 border-pink-200 focus:border-pink-500 outline-none bg-transparent"
                placeholder="x"
                disabled={feedback !== null}
              />
              <span>,</span>
              <input 
                type="number" 
                value={userY} 
                onChange={(e) => setUserY(e.target.value)}
                className="w-16 text-center border-b-4 border-blue-200 focus:border-blue-500 outline-none bg-transparent"
                placeholder="y"
                disabled={feedback !== null}
              />
              <span>)</span>
              
              <button 
                onClick={handlePhase1Submit}
                disabled={!userX || !userY || feedback !== null}
                className="ml-4 bg-emerald-400 text-white p-3 rounded-full hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {phase === "phase2" && (
          <div className="flex flex-col items-center w-full">
            <div className="bg-white/80 px-6 py-2 rounded-full text-blue-500 font-bold mb-4 shadow-sm">
              2단계: 좌표에 점 찍기 ({currentQuestion}/5)
            </div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-4">
              다음 보물의 위치를 클릭하세요!
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-2xl">
                ({targetPoint.x}, {targetPoint.y})
              </span>
            </h2>
            
            {renderGrid(true)}
          </div>
        )}

        {/* Feedback Overlay */}
        {feedback && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
            <div className={`p-10 rounded-3xl shadow-2xl flex flex-col items-center ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} animate-bounce`}>
              {feedback === "correct" ? <CheckCircle2 className="w-24 h-24 mb-4" /> : <XCircle className="w-24 h-24 mb-4" />}
              <h2 className="text-4xl font-bold">{feedback === "correct" ? "정답입니다! 🎉" : "앗, 틀렸어요! 😢"}</h2>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="bg-white/90 p-10 rounded-3xl shadow-2xl shadow-blue-200/50 max-w-lg w-full flex flex-col items-center">
            <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">게임 종료!</h2>
            <p className="text-2xl text-slate-600 mb-8">
              최종 점수: <span className="text-pink-500 font-bold text-5xl ml-2">{score}</span> 점
            </p>
            
            {!supabase ? (
              <div className="text-rose-500 font-medium p-4 bg-rose-50 rounded-xl w-full mb-4">
                Supabase 연동이 설정되지 않아 랭킹을 저장할 수 없습니다. .env.local 파일을 확인해 주세요.
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-6 py-4 rounded-full border-2 border-blue-200 focus:border-blue-500 outline-none text-xl text-center"
                />
                <button 
                  onClick={submitScore}
                  disabled={isSubmitting || !studentName.trim()}
                  className="w-full py-4 bg-blue-500 text-white rounded-full text-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "저장 중..." : "명예의 전당 등록하기!"}
                </button>
              </div>
            )}
            
            <button 
              onClick={startGame}
              className="mt-4 px-8 py-3 bg-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-300 transition-colors"
            >
              다시 도전하기
            </button>
          </div>
        )}

        {phase === "ranking" && (
          <div className="bg-white/90 p-8 rounded-3xl shadow-2xl shadow-yellow-200/50 w-full max-w-2xl">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
              <h2 className="text-4xl font-extrabold text-slate-800">명예의 전당 (Top 10)</h2>
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
            </div>

            <div className="flex flex-col gap-3">
              {rankings.map((rank, index) => (
                <div key={rank.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl hover:bg-pink-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-600' : 'bg-blue-300'}`}>
                      {index + 1}
                    </span>
                    <span className="text-xl font-bold text-slate-700">{rank.student_name}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-pink-500">{rank.score}점</span>
                </div>
              ))}
              {rankings.length === 0 && (
                <p className="text-slate-500 py-4">아직 등록된 랭킹이 없어요! 첫 번째로 도전해 보세요!</p>
              )}
            </div>
            
            <button 
              onClick={startGame}
              className="mt-8 px-8 py-3 bg-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-300 transition-colors"
            >
              다시 도전하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
