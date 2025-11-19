import React from "react";
import { motion } from "framer-motion";
import { Home, Wrench, Sparkles, FileDown, FileText, LineChart } from "lucide-react";
import { NewHouseSVG, RenovationSVG } from "./Illustrations";

const Hero = () => {
  const handleExportCSV = () => {
    if (typeof window !== "undefined" && typeof window.__exportCSV === "function") {
      window.__exportCSV();
    } else {
      const el = document.getElementById("calc");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleExportPDF = () => {
    if (typeof window !== "undefined" && typeof window.__exportPDF === "function") {
      window.__exportPDF();
    } else {
      const el = document.getElementById("calc");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient backdrop */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 600px at -10% -10%, rgba(59,130,246,0.32), transparent 60%), radial-gradient(900px 480px at 120% 10%, rgba(16,185,129,0.26), transparent 60%), radial-gradient(700px 360px at 50% 120%, rgba(244,114,182,0.2), transparent 60%)",
        }}
      />

      {/* Floating blur orbs */}
      <Orb className="left-10 top-20 bg-blue-500/30" delay={0} />
      <Orb className="right-16 top-28 bg-emerald-400/30" size={240} delay={0.2} />
      <Orb className="left-1/2 -translate-x-1/2 bottom-0 bg-pink-400/20" size={360} delay={0.4} />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10 lg:pt-24 lg:pb-16">
        <div className="flex items-center justify-center gap-3 text-blue-200/80">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs tracking-wide uppercase">Edukácia a porovnanie</span>
        </div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-center mt-3"
        >
          Porovnanie: Výstavba nového domu vs. Rekonštrukcia
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-3xl mx-auto text-center text-base sm:text-lg text-blue-100/90 leading-relaxed"
        >
          Táto kalkulačka ukáže, ktorá možnosť je pre vás výhodnejšia. Zadajte vstupy, my vypočítame čistú súčasnú hodnotu (NPV), porovnáme ROI a vizualizujeme cashflow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 max-w-4xl mx-auto text-sm sm:text-base text-blue-100/90 bg-slate-800/60 border border-white/10 rounded-2xl p-5 backdrop-blur"
        >
          <h3 className="font-semibold text-white mb-3">Rýchle vysvetlenie pojmov</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <span className="font-medium text-white">Diskontná miera</span> = percento, ktorým prepočítame budúce náklady/príjmy na dnešnú hodnotu.
            </li>
            <li>
              <span className="font-medium text-white">Zostatková hodnota</span> = odhadovaná cena nehnuteľnosti po investičnom horizonte.
            </li>
          </ul>
          <div className="mt-3 text-xs text-blue-200/80">Príklad: 3 % diskont znamená, že 1000 € o rok má dnes hodnotu približne 970 €.</div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={handleExportPDF} className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 border border-white/15 transition">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={handleExportCSV} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-slate-900 font-medium px-4 py-2 transition">
            <FileDown className="w-4 h-4" /> Export CSV
          </button>
        </motion.div>

        {/* Feature illustrations */}
        <div className="mt-10 grid sm:grid-cols-3 gap-6 items-center">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="shrink-0 hidden sm:block">
              <NewHouseSVG />
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-semibold"><Home className="w-5 h-5 text-blue-400" /> Nový dom</div>
              <p className="text-sm text-blue-200/85 mt-2">Vyšší vstupný náklad, často nižšie prevádzkové náklady a lepšia energetická efektivita.</p>
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.05 }} className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="shrink-0 hidden sm:block">
              <RenovationSVG />
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-semibold"><Wrench className="w-5 h-5 text-emerald-400" /> Rekonštrukcia</div>
              <p className="text-sm text-blue-200/85 mt-2">Nižší vstupný náklad, no možné dodatočné práce a vyššie náklady na údržbu.</p>
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500/30 to-emerald-400/30 grid place-items-center">
                <LineChart className="w-10 h-10 text-white/90" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-semibold">Cashflow vizualizácie</div>
              <p className="text-sm text-blue-200/85 mt-2">Animované grafy kumulatívnych nákladov a medziročného cashflowu s hodnotami na hover.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Orb = ({ className = "", size = 180, delay = 0 }) => (
  <motion.span
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, delay }}
    className={`absolute blur-3xl rounded-full ${className}`}
    style={{ width: size, height: size }}
  />
);

export default Hero;
