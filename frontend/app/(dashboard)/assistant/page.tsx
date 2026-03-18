"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatHistoryItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

interface Message {
  id: string; // generated locally or from db
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AssistantPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<ChatHistoryItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch History on load
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/chat-history", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setHistoryItems(data);
          // Optional: Load latest conversation into view?
          // We will just show empty chat for new message, and history items in sidebar.
          // Or we can pre-fill the chat with the entire history. The prompt doesn't specify deeply, 
          // usually starting a new chat starts empty, so we just populate the Sidebar.
        } else if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching chat history", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchHistory();
  }, [router]);

  const handleNewConversation = () => {
    setMessages([]);
    setInputValue("");
    textareaRef.current?.focus();
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Rafraîchir l'historique dans la sidebar avec le nouveau message
        const newHistoryItem: ChatHistoryItem = {
          id: Date.now(),
          question: data.question,
          answer: data.answer,
          created_at: assistantMessage.timestamp
        };
        setHistoryItems(prev => [newHistoryItem, ...prev]);

      } else if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Désolé, une erreur est survenue lors de la communication avec le serveur.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, impossible de se connecter au serveur.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAutoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const loadPastChat = (item: ChatHistoryItem) => {
    // Si l'utilisateur clique sur une ancienne question, on charge ce bloc Question/Réponse 
    // ou tout l'historique jusqu'à ce point. Pour simplifier: charger juste ce bloc d'échange.
    setMessages([
      { id: `q-${item.id}`, role: "user", content: item.question, timestamp: item.created_at },
      { id: `a-${item.id}`, role: "assistant", content: item.answer, timestamp: item.created_at }
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-slate-900 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">

      {/* --- Sidebar Historique --- */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col hidden md:flex shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleNewConversation}
            className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors text-sm font-semibold rounded-xl py-3 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nouvelle Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-2">Historique récent</h3>
          {pageLoading ? (
            <div className="animate-pulse flex flex-col gap-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>)}
            </div>
          ) : historyItems.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Aucune conversation passée.</p>
          ) : (
            historyItems.map((item) => (
              <button
                key={item.id}
                onClick={() => loadPastChat(item)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors group text-sm"
              >
                <p className="font-semibold text-slate-700 dark:text-slate-300 truncate mb-1 pr-4 relative">
                  <span className="material-symbols-outlined text-[14px] absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">arrow_forward</span>
                  {item.question}
                </p>
                <p className="text-xs text-slate-500 truncate">{new Date(item.created_at).toLocaleDateString()}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* --- Zone Principale de Chat --- */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900">
        {/* En-tête Mobile (Nouvelle conversation) */}
        <div className="md:hidden p-4 border-b border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-2 text-primary font-medium text-sm"
          >
            <span className="material-symbols-outlined">add</span>
            Nouveau Chat
          </button>
        </div>

        {/* --- Messages --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary">TenderscopeAI</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Comment puis-je vous aider ?</h2>
              <p className="text-slate-500 dark:text-slate-400">
                L'IA Tenderscope est entraînée pour répondre à vos questions sur les appels d'offres et optimiser vos chances de succès.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto w-full pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 size-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-primary text-background-dark"}`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {msg.role === "user" ? "Me" : "AI"}
                    </span>
                  </div>

                  {/* Bulle de message */}
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${msg.role === "user" ? "bg-primary text-slate-900 rounded-tr-sm" : "bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-tl-sm text-slate-800 dark:text-slate-200"}`}>
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                    ) : (
                      <div className="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-50 max-w-none text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Animation Loading */}
              {isLoading && (
                <div className="flex gap-4 flex-row">
                  <div className="shrink-0 size-8 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">AI</span>
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-tl-sm flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* --- Zone d'Input --- */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative z-10 shrink-0">
          <div className="max-w-4xl mx-auto relative group">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleAutoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question sur un appel d'offres... (Shift + Enter pour revenir à la ligne)"
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none overflow-y-auto max-h-[200px] transition-shadow shadow-sm"
              rows={1}
              style={{ minHeight: "56px" }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-3 bottom-3 flex items-center justify-center size-9 bg-primary text-background-dark rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
          <div className="text-center mt-3 text-xs text-slate-400">
            Tenderscope IA peut faire des erreurs. Veuillez vérifier les informations importantes.
          </div>
        </div>
      </div>
    </div>
  );
}
