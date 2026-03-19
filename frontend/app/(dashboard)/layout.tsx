"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchBar({ onSearch, initialValue }: { onSearch: (val: string) => void, initialValue: string }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialValue || searchParams.get("q") || "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-96 hidden md:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="            Rechercher par titre ou domaine..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Utilisateur");
  const [userEmail, setUserEmail] = useState("SME User");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.company_name || data.email.split('@')[0]);
          setUserEmail(data.email);
        } else {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
          }
        }
      } catch (err) {
        console.error("Erreur récupération user", err);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const onSearchInternal = (val: string) => {
    const params = new URLSearchParams(window.location.search);
    if (val) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const navLinks = [
    { name: "Tableau de Bord", href: "/dashboard", icon: "dashboard" },
    { name: "Assistant IA", href: "/assistant", icon: "chat" },
    { name: "Mon Profil", href: "/profile", icon: "person" },
  ];

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col transition-all">
        <div className="p-6 flex items-center gap-3 text-primary border-b border-slate-200 dark:border-slate-800">
          <div className="size-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Tenderscope
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{userName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <Suspense fallback={<div className="w-96 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>}>
            <SearchBar onSearch={onSearchInternal} initialValue="" />
          </Suspense>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl px-4 py-2 transition-all font-medium text-sm border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Déconnexion
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
              {children}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

