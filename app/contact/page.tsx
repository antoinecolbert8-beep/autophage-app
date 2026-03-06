"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Zap, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ContactPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Salutations. Je suis l'IA ELA. Comment puis-je vous assister dans votre performance aujourd'hui ?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            const data = await response.json();

            if (data.role) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "Erreur de connexion au système central. Veuillez réessayer." }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Une erreur critique est survenue." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 selection:text-white overflow-hidden flex flex-col">
            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-gray-400 hover:text-[#66fcf1] transition-colors">
                        <ArrowLeft size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">RETOUR AU CADRAN</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo-ela.png"
                            alt="ELA"
                            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        />
                    </Link>

                    <div className="w-20"></div>
                </div>
            </header>

            {/* CHAT CONTAINER */}
            <div className="flex-1 pt-24 pb-24 px-4 md:px-6 relative flex flex-col items-center justify-center">
                {/* Background Ambient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-4xl card-saphir border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[80vh] relative z-10 p-0">

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <Bot size={18} className="text-[#66fcf1]" />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] p-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] leading-relaxed ${msg.role === 'user'
                                        ? 'bg-white text-[#0b0c10] rounded-tr-none'
                                        : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                            <User size={18} className="text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 border border-white/20 animate-pulse">
                                    <Bot size={20} />
                                </div>
                                <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/5">
                        <form onSubmit={sendMessage} className="relative flex items-center gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez votre question à l'IA ELA..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-[#66fcf1]/50 transition-all placeholder:text-gray-600"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-5 bg-white text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all btn-haptic"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <p className="text-[10px] text-gray-700 font-mono tracking-[0.3em] uppercase">POWERED BY ELA // AGENT VOCAL v2.4</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
