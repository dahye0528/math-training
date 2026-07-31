import { Sparkles, Heart, Compass, Plus, Star, BookOpen, Smile, Bot } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 text-slate-700">
      {/* 상단 헤더: 서비스 로고 및 네비게이션 바 */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg shadow-pink-100/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-300 to-yellow-200 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-pink-600" />
          </div>
          <span className="text-2xl font-bold text-pink-500 tracking-wide">
            다혜쌤의 수학교실
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg shadow-blue-100/50">
          <button className="px-5 py-2 rounded-full text-slate-600 hover:text-pink-500 hover:bg-pink-50 transition-colors font-medium">
            홈
          </button>
          <button className="px-5 py-2 rounded-full text-slate-600 hover:text-blue-500 hover:bg-blue-50 transition-colors font-medium">
            학습하기
          </button>
          <button className="px-5 py-2 rounded-full text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 transition-colors font-medium">
            칭찬 스티커판
          </button>
        </nav>
      </header>

      {/* 메인 화면 (Hero Section) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center py-12">
        {/* 귀여운 파스텔 뱃지 */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-100 text-amber-700 text-lg mb-6 shadow-sm shadow-yellow-200">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span>신나는 솜사탕 수학 여행 🎈</span>
        </div>

        {/* 대형 환영 문구 */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-6 drop-shadow-sm">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            반송아이들과 함께하는
          </span>{" "}
          수학수업
        </h1>

        {/* 간단한 설명 */}
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          다혜쌤과 함께 둥글둥글 재미있게 놀면서 배우는 특별한 공간이에요!
          숫자 놀이부터 도형 탐험까지 함께 시작해 볼까요?
        </p>

        {/* 기능 추가용 가짜(Placeholder) 버튼 */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-white text-xl font-bold shadow-xl shadow-pink-200/80 hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center gap-3">
            <Plus className="w-6 h-6 stroke-[3]" />
            새로운 수학 게임 추가하기
          </button>
        </div>

        {/* 기능 소개 카드 (파스텔 솜사탕 컨셉) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16">
          <Link href="/games/coordinate" className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-pink-100/60 flex flex-col items-center hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Compass className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">보물 좌표 찾기</h3>
            <p className="text-slate-500">지도에서 숨겨진 보물의 위치를 찾아봐요</p>
          </Link>

          <Link href="/chatbot" className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-blue-100/60 flex flex-col items-center hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">AI 다혜쌤에게 질문</h3>
            <p className="text-slate-500">궁금한 수학 문제는 챗봇에게 물어봐요</p>
          </Link>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-emerald-100/60 flex flex-col items-center hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Smile className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">칭찬 참 잘했어요</h3>
            <p className="text-slate-500">매일 참 잘했어요 스티커를 모아보세요</p>
          </div>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 text-center text-slate-500 text-lg border-t border-pink-100/50 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          <span>다혜쌤의 수학교실</span>
        </div>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} 다혜쌤의 수학교실. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
