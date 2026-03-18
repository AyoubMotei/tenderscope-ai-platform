"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Tender {
  id: number;
  title: string;
  domain: string;
  city: string;
  description: string;
}

interface MatchResult {
  tender_title: string;
  score: number;
  decision: string;
}

interface EnrichedTender {
  id: string | number;
  title: string;
  domain: string;
  city: string;
  score: number | null;
  decision: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  
  const [tenders, setTenders] = useState<EnrichedTender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMatched, setHasMatched] = useState(false);

  // Étape 1 : Chargement initial des offres brutes
  const fetchTenders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/tenders");
      if (!response.ok) throw new Error("Erreur de récupération des appels d'offres");
      const rawTenders: Tender[] = await response.json();
      
      const mappedTenders: EnrichedTender[] = rawTenders.map(t => ({
        id: t.id,
        title: t.title,
        domain: t.domain, // Correction du bug : on utilise domain au lieu de sector
        city: t.city,
        score: null,
        decision: null
      }));
      setTenders(mappedTenders);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les opportunités.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Étape 2 : Lancement de l'analyse IA
  const handleMatchAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const matchResponse = await fetch("http://localhost:8000/match", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!matchResponse.ok) throw new Error("Erreur lors de l'analyse");
      const matchData: MatchResult[] = await matchResponse.json();

      // Fusion avec les offres existantes
      setTenders(prevTenders => {
        const enriched = prevTenders.map(tender => {
          const match = matchData.find(m => m.tender_title === tender.title);
          return {
            ...tender,
            score: match?.score ?? null,
            decision: match?.decision ?? null,
          };
        });
        
        // On trie par score décroissant, en mettant les non-évalués à la fin
        return enriched.sort((a, b) => {
           const scoreA = a.score || 0;
           const scoreB = b.score || 0;
           return scoreB - scoreA;
        });
      });
      setHasMatched(true);
      
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de l'analyse des correspondances. Réessayez.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, [fetchTenders]);

  // Étape 3 : Filtrage par barre de recherche
  const filteredTenders = useMemo(() => {
    if (!searchQuery) return tenders;
    return tenders.filter((t) => 
      t.title.toLowerCase().includes(searchQuery) ||
      t.domain.toLowerCase().includes(searchQuery)
    );
  }, [tenders, searchQuery]);

  const getDecisionBadge = (decision: string | null, score: number | null) => {
    if (!decision && score === null) return null;
    
    const d = decision?.toUpperCase() || (
       score !== null && score > 70 ? "GO" : 
       score !== null && score >= 40 ? "MAYBE" : "NO-GO"
    );

    switch (d) {
      case "GO":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
             GO
          </span>
        );
      case "MAYBE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
             MAYBE
          </span>
        );
      case "NO-GO":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
             NO-GO
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Tableau de Bord
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">
              {hasMatched 
                ? "Résultats de l'analyse terminés. Voici vos meilleures correspondances." 
                : "Découvrez les appels d'offres publics et lancez l'IA pour calculer votre compatibilité."}
            </p>
          </div>
          <button
            onClick={handleMatchAnalysis}
            disabled={isAnalyzing || isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-[15px] font-black text-background-dark transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20 shrink-0"
          >
            <span className={`material-symbols-outlined text-[20px] ${isAnalyzing ? 'animate-spin' : ''}`}>
              {!hasMatched ? 'magic_button' : 'sync'}
            </span>
            {isAnalyzing 
              ? "Analyse en cours..." 
              : !hasMatched ? "Lancer l'analyse des Matchs" : "Relancer l'analyse"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Tenders List */}
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">feed</span>
        {searchQuery ? "Résultats de recherche" : (hasMatched ? "Vos recommandations" : "Tous les appels d'offres")}
      </h2>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6 animate-pulse shadow-sm">
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
              </div>
              <div className="md:w-32 flex flex-col items-end justify-center gap-2">
                 <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
                 <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Aucune opportunité trouvée</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Nous n'avons pas trouvé de résultat pour "{searchQuery}".
            </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTenders.map((tender) => (
            <div 
              key={tender.id} 
              className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group"
            >
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between">
                   <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3 group-hover:text-primary transition-colors">
                     {tender.title}
                   </h2>
                   {/* Mobile Badge View */}
                   <div className="md:hidden mt-0">
                     {getDecisionBadge(tender.decision, tender.score)}
                   </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="material-symbols-outlined text-[16px]">domain</span>
                    {tender.domain || "Domaine non défini"}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {tender.city}
                  </div>
                </div>
              </div>

              {/* Score & Badge Desktop View */}
              <div className="md:w-auto w-full flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 pl-0 md:pl-6">
                 <div className="hidden md:block">
                   {getDecisionBadge(tender.decision, tender.score)}
                 </div>
                 {tender.score !== null ? (
                   <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                     <span className="text-2xl tracking-tighter">{tender.score}</span>
                     <span className="text-sm opacity-50">%</span>
                   </div>
                 ) : (
                   <div className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                     Non évalué
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
