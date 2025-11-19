import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, LineChart, Factory, Flame, Building2 } from "lucide-react";

const items = [
  {
    icon: <Building2 className="w-5 h-5 text-blue-400" />,
    title: "Vek domov vs. životnosť",
    text: "Priemerný vek rodinných domov na Slovensku presahuje 30 rokov. Životnosť kvalitnej rekonštrukcie môže byť 20–30 rokov pri pravidelnej údržbe.",
  },
  {
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    title: "Náklady na energiu",
    text: "V energeticky neefektívnych domoch ide 40–60 % prevádzkových nákladov na vykurovanie. Zateplenie a výmena okien znižujú náklady aj emisie.",
  },
  {
    icon: <Factory className="w-5 h-5 text-emerald-400" />,
    title: "Údržba vs. modernizácia",
    text: "Staršie nehnuteľnosti vyžadujú vyšší podiel výdavkov na údržbu. Modernizácia technológií vie výrazne znížiť poruchovosť.",
  },
  {
    icon: <LineChart className="w-5 h-5 text-purple-400" />,
    title: "Regionálne ceny",
    text: "Ceny nehnuteľností sa líšia podľa regiónu a dostupnosti. Pri odhade zostatkovej hodnoty zohľadnite lokálne trendy.",
  },
];

const Facts = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 text-white font-semibold mb-4"><Info className="w-5 h-5 text-amber-400" /> Zaujímavosti a fakty</div>
        <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 border border-white/10 p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid sm:grid-cols-[40px_1fr] gap-4 items-start"
            >
              <div className="hidden sm:flex items-center justify-center mt-1">{items[index].icon}</div>
              <div>
                <div className="text-white font-medium">{items[index].title}</div>
                <p className="text-sm text-blue-100/90 mt-1 leading-relaxed">{items[index].text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition ${index === i ? "w-6 bg-white" : "w-3 bg-white/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facts;
