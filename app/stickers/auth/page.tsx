"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

const PASSWORD = "0528"

export default function StickerAuthPage() {
  const [pwd, setPwd] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd === PASSWORD) {
      // set flag for teacher
      if (typeof window !== "undefined") {
        localStorage.setItem("isTeacher", "true")
      }
      // redirect to stickers overview
      router.push("/stickers")
    } else {
      setError("비밀번호가 틀렸습니다.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center">
        <Link href="/" className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-500">홈으로</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-6">
          스티커판 관리자 인증
        </h1>
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-sm">
          <div className="flex items-center mb-4">
            <Lock className="w-6 h-6 text-pink-500 mr-2" />
            <label htmlFor="pwd" className="text-lg font-medium text-slate-700">비밀번호</label>
          </div>
          <input
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            인증하기
            <button
              type="button"
              onClick={() => {
                // Set teacher flag to false (or remove) and navigate to stickers view
                if (typeof window !== 'undefined') {
                  localStorage.setItem('isTeacher', 'false');
                }
                router.push('/stickers');
              }}
              className="mt-4 w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              학생으로 보기
            </button>
        </form>
      </main>
    </div>
  )
}
