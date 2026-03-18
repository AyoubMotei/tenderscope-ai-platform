"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Briefcase, LogOut, Edit2, User } from "lucide-react";

interface UserProfile {
  email: string;
  company_name: string;
  sector: string;
  city: string;
  description: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil");
        }

        const data: UserProfile = await response.json();
        setProfile(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Impossible de charger les informations du profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-12">
        {/* Skeleton Loader */}
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="flex-1 space-y-4 w-full">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
        <p>{error || "Impossible de charger les données."}</p>
        <button onClick={() => router.push("/login")} className="mt-4 underline font-medium">
          Retourner à la connexion
        </button>
      </div>
    );
  }

  // Obtenir les initiales pour l'avatar par défaut
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto w-full">

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 w-full text-center md:text-left">

          {/* Avatar Base */}
          <div className="flex items-center justify-center w-24 h-24 bg-primary/10 text-primary rounded-full text-3xl font-black border-4 border-white dark:border-slate-800 shadow-md shrink-0">
            {profile.company_name ? getInitials(profile.company_name) : <User size={40} />}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {profile.company_name || "Entreprise"}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center md:justify-start items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                <Briefcase size={16} />
                {profile.sector || "Secteur non renseigné"}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors w-full md:w-auto"
            >
              <Edit2 size={18} />
              Modifier le profil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl font-semibold transition-colors w-full md:w-auto"
            >
              <LogOut size={18} />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Email</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100 break-all">{profile.email || "Non renseigné"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Ville</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{profile.city || "Non renseigné"}</p>
          </div>
        </div>
      </div>

      {/* IA Profile - Description */}
      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">Tenderscope</span>
            Description & Profil IA
          </h2>
        </div>

        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl rounded-tl-none relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">Note importante :</span> Cette description est utilisée par notre algorithme d'IA pour analyser pertinemment votre expertise et calculer les scores de matching avec les appels d'offres publics.
          </p>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 min-h-[150px]">
          {profile.description ? (
            <p className="whitespace-pre-wrap leading-relaxed">
              {profile.description}
            </p>
          ) : (
            <p className="text-slate-400 italic">Aucune description renseignée pour le moment.</p>
          )}
        </div>
      </div>

    </div>
  );
}
