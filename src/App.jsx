import React from "react";
import Hero from "./components/Hero";
import Calculator from "./components/Calculator";
import FooterInfo from "./components/FooterInfo";
import Facts from "./components/Facts";
import FAQ from "./components/FAQ";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      {/* Decorative gradients */}
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 backdrop-blur bg-slate-950/40 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400" />
            <span className="font-semibold text-white">Investičné porovnanie</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-blue-200/80">
            <a href="#calc" className="hover:text-white transition">Kalkulačka</a>
            <a href="#facts" className="hover:text-white transition">Fakty</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <div id="calc"><Calculator /></div>
        <div id="facts"><Facts /></div>
        <div id="faq"><FAQ /></div>
        <div id="infos"><FooterInfo /></div>
      </main>

      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-blue-200/70">
          © {new Date().getFullYear()} Edukačný nástroj – výsledky majú informačný charakter a nenahrádzajú odborné poradenstvo. Exporty: PDF / CSV.
        </div>
      </footer>
    </div>
  );
}

export default App;
