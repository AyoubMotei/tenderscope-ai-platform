export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 lg:px-40 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">insights</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Tenderscope AI</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-8">
              <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Produits</a>
              <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Tarifs</a>
              <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Avis</a>
              <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Contact</a>
            </nav>
            <div className="flex gap-3">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
                <span>Log in</span>
              </button>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:brightness-110 transition-all">
                <span>Try for free</span>
              </button>
            </div>
          </div>
          <button className="md:hidden text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col flex-1">
          {/* Hero Section */}
          <section className="px-6 md:px-20 lg:px-40 py-16 md:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex flex-col gap-8 flex-1">
                <div className="flex flex-col gap-4">
                  <span className="text-primary font-bold tracking-widest text-xs uppercase">L'intelligence artificielle pour vos appels d'offres</span>
                  <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                    Optimisez vos chances de remporter des <span className="text-primary">marchés publics</span> grâce à l'IA
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-[600px]">
                    Gagnez du temps et augmentez votre taux de réussite avec notre solution d'intelligence artificielle dédiée aux appels d'offres.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-background-dark text-lg font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    <span>Essayer gratuitement</span>
                  </button>
                  <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span>Voir la démo</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-300" data-alt="Avatar of a satisfied user"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-400" data-alt="Avatar of a company representative"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-500" data-alt="Avatar of a procurement expert"></div>
                  </div>
                  <span>Rejoint par +500 entreprises innovantes</span>
                </div>
              </div>
              <div className="flex-1 w-full max-w-[600px]">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video bg-slate-800" data-alt="Dashboard showing AI tender analysis interface">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-6xl opacity-50">play_circle</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-6 md:px-20 lg:px-40 py-20 bg-slate-50 dark:bg-slate-900/30">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
                <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Fonctionnalités</h2>
                <h3 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold">L'IA au service de votre succès</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Découvrez comment nos outils innovants transforment votre manière de répondre aux marchés publics.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all shadow-sm">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors text-primary">
                    <span className="material-symbols-outlined text-3xl">target</span>
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">AI Matching</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Identifiez instantanément les opportunités les plus pertinentes pour votre entreprise grâce à notre algorithme de scoring propriétaire. Ne perdez plus de temps sur des dossiers hors cible.</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Scoring de pertinence en temps réel</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Alertes personnalisées quotidiennes</li>
                  </ul>
                </div>
                <div className="group p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all shadow-sm">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors text-primary">
                    <span className="material-symbols-outlined text-3xl">smart_toy</span>
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">RAG Assistant</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Interrogez vos documents de réponse et les dossiers de consultation pour générer des contenus de haute qualité en un clic. Une assistance intelligente basée sur vos données historiques.</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Génération de mémoire technique</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Analyse de conformité automatique</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="px-6 md:px-20 lg:px-40 py-24">
            <div className="flex flex-col gap-16">
              <div className="text-center">
                <h3 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Une approche simplifiée pour maximiser votre efficacité opérationnelle.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-slate-200 dark:bg-slate-800 -z-10"></div>
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-background-dark font-black text-2xl shadow-lg shadow-primary/20">1</div>
                  <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-bold text-slate-900 dark:text-slate-100">Créez votre profil</h5>
                    <p className="text-slate-600 dark:text-slate-400">Définissez vos domaines d'expertise, votre zone géographique et vos critères cibles.</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-background-dark font-black text-2xl shadow-lg shadow-primary/20">2</div>
                  <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-bold text-slate-900 dark:text-slate-100">Importez vos documents</h5>
                    <p className="text-slate-600 dark:text-slate-400">Téléchargez vos mémoires techniques passés et vos documents de référence pour nourrir l'IA.</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-background-dark font-black text-2xl shadow-lg shadow-primary/20">3</div>
                  <div className="flex flex-col gap-2">
                    <h5 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysez &amp; Répondez</h5>
                    <p className="text-slate-600 dark:text-slate-400">L'IA identifie les meilleurs dossiers et vous aide à rédiger des réponses percutantes en un temps record.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-6 md:px-20 lg:px-40 py-20 mb-12">
            <div className="bg-primary rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex flex-col gap-4 max-w-xl text-center md:text-left">
                <h2 className="text-background-dark text-3xl md:text-4xl font-black">Prêt à transformer vos réponses aux appels d'offres ?</h2>
                <p className="text-background-dark/80 text-lg font-medium">Rejoignez les entreprises qui gagnent déjà avec Tenderscope AI.</p>
              </div>
              <button className="bg-background-dark text-white px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition-transform whitespace-nowrap">
                Commencer maintenant
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-6 md:px-20 lg:px-40 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-2xl">insights</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Tenderscope AI</span>
              </div>
              <p className="text-sm text-slate-500">L'IA de nouvelle génération pour la commande publique.</p>
            </div>
            <div>
              <h6 className="text-slate-900 dark:text-slate-100 font-bold mb-4 uppercase text-xs tracking-widest">Produit</h6>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary" href="#">Fonctionnalités</a></li>
                <li><a className="hover:text-primary" href="#">Sécurité</a></li>
                <li><a className="hover:text-primary" href="#">Tarification</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-slate-900 dark:text-slate-100 font-bold mb-4 uppercase text-xs tracking-widest">Entreprise</h6>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary" href="#">À propos</a></li>
                <li><a className="hover:text-primary" href="#">Blog</a></li>
                <li><a className="hover:text-primary" href="#">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-slate-900 dark:text-slate-100 font-bold mb-4 uppercase text-xs tracking-widest">Légal</h6>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary" href="#">Mentions légales</a></li>
                <li><a className="hover:text-primary" href="#">Confidentialité</a></li>
                <li><a className="hover:text-primary" href="#">CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
            © 2026 Tenderscope AI. Tous droits réservés.
          </div>
        </footer>
      </div>
    </div>
  );
}
