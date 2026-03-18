"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company_name: "",
    sector: "",
    city: "",
    description: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sectors = [
    "BTP / Construction",
    "Informatique / Tech",
    "Services Publics",
    "Santé",
    "Énergie",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Une erreur est survenue lors de l'inscription.");
      }

      const data = await response.json();
      // On log le succès et on enregistre le token
      console.log("Inscription réussie:", data);
      localStorage.setItem("token", data.access_token);
      
      // Redirection après succès (vers dashboard ou accueil)
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 lg:px-40 py-4 bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-4 text-primary">
              <div className="size-6">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">
                Tenderscope AI
              </h2>
            </div>
            <Link
              href="/login"
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Connexion
            </Link>
          </header>

          <main className="flex flex-1 justify-center py-10 px-6 md:px-20 lg:px-40">
            <div className="flex flex-col max-w-[800px] flex-1">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
                  Créez votre compte entreprise
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Rejoignez la plateforme d'analyse d'appels d'offres boostée par l'IA.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Credentials Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-primary font-bold">●</span>
                    <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Vos identifiants
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col flex-1">
                      <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                        Email professionnel
                      </p>
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-slate-400 p-[15px] text-base"
                        placeholder="exemple@entreprise.fr"
                        type="email"
                      />
                    </label>
                    <label className="flex flex-col flex-1">
                      <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                        Mot de passe
                      </p>
                      <div className="flex w-full items-stretch rounded-lg group">
                        <input
                          required
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-slate-400 p-[15px] rounded-r-none border-r-0 pr-2 text-base"
                          placeholder="********"
                          type={showPassword ? "text" : "password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 flex border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 items-center justify-center px-[15px] rounded-r-lg border-l-0 hover:text-primary transition-colors"
                        >
                          {showPassword ? "Masquer" : "Afficher"}
                        </button>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Company Profile Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-primary font-bold">■</span>
                    <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Profil Entreprise
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col flex-1">
                      <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                        Nom de l'entreprise
                      </p>
                      <input
                        required
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-slate-400 p-[15px] text-base"
                        placeholder="Ma Société SAS"
                      />
                    </label>
                    <label className="flex flex-col flex-1">
                      <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                        Secteur d'activité
                      </p>
                      <select
                        required
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 p-[15px] text-base appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Sélectionnez un secteur
                        </option>
                        {sectors.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col flex-1 md:col-span-2">
                      <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                        Ville du siège social
                      </p>
                      <div className="relative">
                        <input
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-slate-400 px-[15px] text-base"
                          placeholder="Paris, Lyon..."
                        />
                      </div>
                    </label>
                  </div>
                </section>

                {/* Additional Details Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-primary font-bold">➲</span>
                    <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Description détaillée
                    </h2>
                  </div>
                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                      Parlez-nous de vos objectifs (facultatif)
                    </p>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 min-h-32 placeholder:text-slate-400 p-[15px] text-base"
                      placeholder="Décrivez votre expertise pour aider notre IA à mieux cibler vos opportunités..."
                    ></textarea>
                  </label>
                </section>

                {/* Submit Section */}
                <div className="pt-6">
                  <div className="flex items-start gap-3 mb-6">
                    <input
                      required
                      className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary mt-1 cursor-pointer"
                      id="terms"
                      type="checkbox"
                    />
                    <label
                      className="text-sm text-slate-600 dark:text-slate-400"
                      htmlFor="terms"
                    >
                      J'accepte les{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Conditions Générales d'Utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Politique de Confidentialité
                      </Link>
                      .
                    </label>
                  </div>
                  <button
                    disabled={isLoading}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 bg-primary text-background-dark text-lg font-black leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50"
                    type="submit"
                  >
                    <span className="truncate">
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </span>
                  </button>
                </div>
              </form>
              <p className="text-center text-slate-600 dark:text-slate-400 mt-8 mb-12">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </main>

          {/* Footer Small */}
          <footer className="px-6 md:px-20 lg:px-40 py-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>© 2024 Tenderscope AI. Tous droits réservés.</p>
              <div className="flex gap-6">
                <Link className="hover:text-primary" href="#">
                  Aide
                </Link>
                <Link className="hover:text-primary" href="#">
                  Contact
                </Link>
                <Link className="hover:text-primary" href="#">
                  Mentions légales
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
