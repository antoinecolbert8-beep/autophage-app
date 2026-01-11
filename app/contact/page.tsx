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
        { role: "assistant", content: "Salutations. Je suis GENESIS. Comment puis-je vous assister dans votre domination du marché aujourd'hui ?" }
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
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-pink-500/30 overflow-hidden flex flex-col">
            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-bold">Retour</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-pink-500 flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30"></div>
                            <Zap className="w-4 h-4 text-white relative z-10" />
                        </div>
                        <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
                            GENESIS
                        </span>
                    </Link>

                    <div className="w-20"></div>
                </div>
            </header>

            {/* CHAT CONTAINER */}
            <div className="flex-1 pt-24 pb-24 px-4 md:px-6 relative flex flex-col items-center justify-center">
                {/* Background Ambient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-4xl bg-[#13131f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[80vh] relative z-10 backdrop-blur-sm">

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
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 border border-white/20">
                                            <Bot size={20} />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${msg.role === 'user'
                                            ? 'bg-white text-black font-medium rounded-tr-none'
                                            : 'bg-[#0a0a0f] border border-white/10 text-gray-300 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                            <User size={20} />
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
                    <div className="p-4 bg-[#0a0a0f] border-t border-white/10">
                        <form onSubmit={sendMessage} className="relative flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez votre question à Genesis..."
                                className="flex-1 bg-[#13131f] border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-1"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Powered by Genesis AI v2.4</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
