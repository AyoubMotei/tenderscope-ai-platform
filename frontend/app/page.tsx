"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Target,
  Menu,
  X,
  ChevronRight,
  Search,
  FileText
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary/30 selection:text-primary">
      {/* Navbar */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="text-primary size-6 fill-primary/20" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">TENDERSCOPE AI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">Comment ça marche</a>
              <a href="#security" className="hover:text-primary transition-colors">Sécurité</a>
            </nav>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2.5 bg-primary text-background-dark text-sm font-black rounded-xl hover:brightness-110 hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                S'inscrire
              </Link>
            </div>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass absolute top-full left-0 w-full p-6 space-y-4 border-t border-white/10 animate-fade-in">
            <Link href="/login" className="block text-center py-3 font-bold border border-white/10 rounded-xl">Connexion</Link>
            <Link href="/register" className="block text-center py-3 font-bold bg-primary text-background-dark rounded-xl">S'inscrire</Link>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-20 left-1/4 size-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-1/4 size-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              L'IA GÉNÉRATIVE AU SERVICE DES MARCHÉS PUBLICS
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9] animate-slide-up">
              Ne perdez plus de temps sur les <span className="text-primary italic">mauvais</span> appels d'offres.
            </h1>
            
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 animate-slide-up delay-200">
              Identifiez instantanément vos chances de succès grâce à notre moteur de matching IA et analysez vos documents techniques en quelques secondes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
              <Link 
                href="/register" 
                className="group w-full sm:w-auto px-8 py-5 bg-primary text-background-dark text-lg font-black rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                Démarrer l'analyse gratuite
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-5 border border-white/10 hover:bg-white/5 text-lg font-bold rounded-2xl transition-all">
                Voir la démo
              </button>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-20 relative reveal opacity-0">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
              <div className="glass rounded-[2rem] p-4 border-white/10 shadow-2xl relative overflow-hidden">
                <div className="bg-slate-900/80 rounded-2xl border border-white/5 aspect-[16/9] flex flex-col">
                   <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-slate-800/50">
                      <div className="flex gap-1.5">
                        <div className="size-3 rounded-full bg-red-500/50" />
                        <div className="size-3 rounded-full bg-amber-500/50" />
                        <div className="size-3 rounded-full bg-emerald-500/50" />
                      </div>
                      <div className="px-4 py-1 rounded-lg bg-slate-900/50 text-[10px] font-mono text-slate-500 border border-white/5">
                        tenderscope-ai-v1.0.local
                      </div>
                   </div>
                   <div className="flex-1 p-6 grid grid-cols-12 gap-6">
                      <div className="col-span-3 space-y-4">
                        <div className="h-8 bg-white/5 rounded-lg w-full" />
                        <div className="h-8 bg-primary/10 rounded-lg w-full border border-primary/20" />
                        <div className="h-8 bg-white/5 rounded-lg w-full" />
                      </div>
                      <div className="col-span-9 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="h-6 bg-white/10 rounded-lg w-1/3" />
                          <div className="h-10 w-10 rounded-full bg-primary/20" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                              <div className="size-6 bg-primary/20 rounded-lg" />
                              <div className="h-3 bg-white/10 rounded-full w-2/3" />
                           </div>
                           <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                              <div className="size-6 bg-emerald-500/20 rounded-lg" />
                              <div className="h-3 bg-white/10 rounded-full w-2/3" />
                           </div>
                           <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                              <div className="size-6 bg-amber-500/20 rounded-lg" />
                              <div className="h-3 bg-white/10 rounded-full w-2/3" />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="h-12 bg-white/5 rounded-xl border border-white/5 w-full flex items-center px-4 gap-4">
                              <div className="size-6 bg-primary/30 rounded-full" />
                              <div className="h-2 bg-white/10 rounded-full flex-1" />
                              <div className="h-2 bg-primary/50 rounded-full w-12" />
                           </div>
                           <div className="h-12 bg-white/5 rounded-xl border border-white/5 w-full flex items-center px-4 gap-4">
                              <div className="size-6 bg-emerald-500/30 rounded-full" />
                              <div className="h-2 bg-white/10 rounded-full flex-1" />
                              <div className="h-2 bg-emerald-500/50 rounded-full w-8" />
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
                {/* Score floating badge */}
                <div className="absolute top-1/2 right-12 size-32 glass rounded-full flex flex-col items-center justify-center border-primary/30 shadow-primary/20 animate-bounce transition-all">
                  <span className="text-3xl font-black text-primary">94%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Match score</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-white/5 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Adapté à tous les secteurs stratégiques</p>
            <div className="w-full flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-2">
                 <Zap className="size-6" />
                 <span className="text-xl font-bold">ÉNERGIE</span>
               </div>
               <div className="flex items-center gap-2">
                 <Target className="size-6" />
                 <span className="text-xl font-bold">IT SERVICES</span>
               </div>
               <div className="flex items-center gap-3">
                 <ShieldCheck className="size-6" />
                 <span className="text-xl font-bold">SANTÉ</span>
               </div>
               <div className="flex items-center gap-2">
                 <BarChart3 className="size-6" />
                 <span className="text-xl font-bold">BTP</span>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-20 reveal opacity-0">
              <h2 className="text-primary font-bold text-sm uppercase tracking-widest mb-4">La technologie de pointe</h2>
              <h3 className="text-4xl md:text-5xl font-black mb-6">Accélérez votre croissance avec nos trois piliers.</h3>
              <p className="text-slate-400 text-lg">Plus qu'un simple outil, nous vous offrons une suite complète pour dominer votre secteur public.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 glass rounded-3xl hover:border-primary/50 transition-all reveal opacity-0 delay-100">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-background-dark transition-all">
                  <Target className="size-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Smart Matching</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Analyse de votre profil entreprise contre des milliers d'appels d'offres. Score GO/NO-GO automatique basé sur la proximité sémantique.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4 text-primary" />
                    Infrastructure Gaz, Hospitalier
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4 text-primary" />
                    Précision de matching &gt; 95%
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 glass rounded-3xl hover:border-primary/50 transition-all reveal opacity-0 delay-200">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-background-dark transition-all">
                  <MessageSquare className="size-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Assistant RAG</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Posez des questions complexes à vos documents (CPS, DCE) et obtenez des réponses sourcées. L'IA documentaire au service de votre expertise.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4 text-primary" />
                    Sources citées directement
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4 text-primary" />
                    Analyse de maintenance réseau
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 glass rounded-3xl hover:border-primary/50 transition-all reveal opacity-0 delay-300">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-background-dark transition-all">
                  <BarChart3 className="size-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Dashboard Décisionnel</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Une vue centralisée pour piloter vos candidatures et suivre votre historique. Gardez une vision claire sur vos opportunités en cours.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4 text-primary" />
                    Suivi en temps réel
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4 text-primary" />
                    Export des rapports intelligent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-16 reveal opacity-0">Une transition fluide en 3 étapes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-px bg-white/10 -z-10" />
              
              <div className="flex flex-col items-center gap-6 reveal opacity-0 delay-100">
                <div className="size-20 rounded-full glass flex items-center justify-center text-3xl font-black text-primary border-primary/30 shadow-lg shadow-primary/10">1</div>
                <h5 className="text-xl font-bold">Inscrivez votre profil</h5>
                <p className="text-slate-500">Décrivez votre entreprise et vos domaines d'expertise stratégiques.</p>
              </div>
              
              <div className="flex flex-col items-center gap-6 reveal opacity-0 delay-200">
                <div className="size-20 rounded-full glass flex items-center justify-center text-3xl font-black text-primary border-primary/30 shadow-lg shadow-primary/10">2</div>
                <h5 className="text-xl font-bold">Importez vos documents</h5>
                <p className="text-slate-500">L'IA analyse vos médaas et CPS pour comprendre vos capacités réelles.</p>
              </div>
              
              <div className="flex flex-col items-center gap-6 reveal opacity-0 delay-300">
                <div className="size-20 rounded-full glass flex items-center justify-center text-3xl font-black text-primary border-primary/30 shadow-lg shadow-primary/10">3</div>
                <h5 className="text-xl font-bold">L'IA décide pour vous</h5>
                <p className="text-slate-500">Recevez des scores Go/No-Go précis et gagnez vos futurs marchés.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security / JWT Mention */}
        <section id="security" className="py-24">
           <div className="max-w-4xl mx-auto px-6 glass rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 border-primary/20 reveal opacity-0">
              <div className="size-24 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="size-12 text-emerald-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">Sécurité sans compromis</h3>
                <p className="text-slate-400 leading-relaxed">
                  Vos données et documents techniques sont protégés par un <span className="text-white font-bold">cryptage JWT de grade industriel</span>. 
                  Nous garantissons la confidentialité totale de votre stratégie commerciale.
                </p>
              </div>
           </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative glass rounded-[3rem] p-8 md:p-20 overflow-hidden text-center reveal opacity-0">
               {/* Decorative circles */}
               <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-3xl -z-10" />
               <div className="absolute bottom-0 left-0 size-64 bg-blue-600/10 blur-3xl -z-10" />
               
               <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Prêt à transformer votre <br /> <span className="text-primary">stratégie commerciale ?</span>
              </h2>
              <p className="max-w-xl mx-auto text-slate-400 text-lg mb-12">
                Rejoignez les leaders du marché qui utilisent déjà Tenderscope AI pour automatiser leur croissance.
              </p>
              <Link 
                href="/register" 
                className="inline-flex px-12 py-6 bg-primary text-background-dark text-xl font-black rounded-2xl hover:brightness-110 hover:scale-105 transition-all shadow-2xl shadow-primary/30"
              >
                Commencer l'aventure
                <ChevronRight className="ml-2 size-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="text-background-dark size-5 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">Tenderscope AI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              La plateforme intelligente pour détecter, analyser et gagner vos appels d'offres en un clin d'œil.
            </p>
          </div>

          <div>
             <h6 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Liens rapides</h6>
             <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">Comment ça marche</a></li>
                <li><a href="/login" className="hover:text-primary transition-colors">Connexion</a></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">S'inscrire</Link></li>
             </ul>
          </div>

          <div>
             <h6 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h6>
             <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
             </ul>
          </div>

          <div>
             <h6 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Légal</h6>
             <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
           <p>© 2026 TENDERSCOPE AI. TOUS DROITS RÉSERVÉS.</p>
           <p>FAIT AVEC ❤️ POUR LE FUTUR DES SMEs</p>
        </div>
      </footer>
    </div>
  );
}
