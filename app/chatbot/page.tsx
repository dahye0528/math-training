"use client";

import { useChat } from 'ai/react';
import { Bot, User, Send, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function ChatbotPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-emerald-50 text-slate-700 font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
          <span className="text-xl font-bold text-pink-500">홈으로 가기</span>
        </Link>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold text-slate-700">AI 다혜쌤 챗봇</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pb-6 flex flex-col h-[calc(100vh-100px)]">
        <div className="flex-1 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-pink-100/50 flex flex-col overflow-hidden border border-white/50">
          
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Bot className="w-20 h-20 mb-4 text-pink-300 animate-bounce" />
                <p className="text-xl font-bold text-slate-500">안녕! 나는 AI 다혜쌤이야 🎈</p>
                <p>수학에 대해 궁금한 점이 있으면 무엇이든 물어봐!</p>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                    m.role === 'user' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'
                  }`}>
                    {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-6 py-4 rounded-3xl text-lg ${
                    m.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-tr-sm shadow-blue-200/50' 
                      : 'bg-slate-100 text-slate-700 rounded-tl-sm shadow-slate-200/50'
                  } shadow-md`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>

                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[80%] flex-row">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="px-6 py-4 rounded-3xl bg-slate-100 text-slate-500 rounded-tl-sm shadow-md flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="flex gap-3 relative">
              <input
                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-pink-300 focus:bg-white rounded-full text-lg outline-none transition-all pr-16"
                value={input}
                onChange={handleInputChange}
                placeholder="질문을 입력해 주세요..."
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 w-12 h-12 flex items-center justify-center bg-pink-400 text-white rounded-full hover:bg-pink-500 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-md"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>
          
        </div>
      </main>
    </div>
  );
}
