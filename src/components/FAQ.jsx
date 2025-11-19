import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Kedy sa oplatí rekonštrukcia?",
    a: "Ak je obstarávacia cena + rekonštrukcia výrazne nižšia než novostavba a dom má dobrý základ (statika, strecha, vlhkosť), rekonštrukcia môže byť výhodnejšia. Dôležité je zohľadniť aj budúce prevádzkové náklady.",
  },
  {
    q: "Ako správne zvoliť diskontnú mieru?",
    a: "Vychádzajte z alternatívnych možností zhodnotenia (napr. bezriziková sadzba + riziková prémia), inflácie a vašej požadovanej návratnosti. Typicky 3–8 % p.a. pre rezidenčné projekty.",
  },
  {
    q: "Ako odhadnúť zostatkovú hodnotu?",
    a: "Pozrite si porovnateľné nehnuteľnosti v lokalite, trend cien a očakávaný technický stav po danom horizonte. Zahrňte konzervatívnu rezervu.",
  },
  {
    q: "Čo zahrnúť do ročných nákladov?",
    a: "Energiu, údržbu, poistenie, fond opráv, servis technológií, prípadne správu. Nezabudnite na rezervu na nečakané výdavky.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 text-white font-semibold mb-4"><HelpCircle className="w-5 h-5 text-blue-400" /> Často kladené otázky</div>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className="rounded-2xl bg-slate-800/60 border border-white/10">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left px-5 py-4 flex items-center justify-between">
                <span className="text-white font-medium">{item.q}</span>
                <span className="text-blue-200/80 text-sm">{open === i ? "–" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="px-5 pb-4 text-sm text-blue-100/90 leading-relaxed">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
