import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, BookOpen, Shield } from "lucide-react";

const FooterInfo = () => {
  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <Card icon={<Lightbulb className="w-5 h-5 text-amber-400" />} title="Ako pracovať s výsledkami">
          <ul className="list-disc list-inside space-y-2 text-blue-100/90 text-sm leading-relaxed">
            <li>Vnímajte NPV ako porovnávací ukazovateľ – čím vyššia (menej záporná), tým lepšie.</li>
            <li>Ak sú hodnoty veľmi blízko, rozhodnite sa podľa kvalitatívnych faktorov.</li>
            <li>Pri neistote si pripravte alternatívny scenár s konzervatívnejšími odhadmi.</li>
          </ul>
        </Card>
        <Card icon={<BookOpen className="w-5 h-5 text-blue-400" />} title="Zaujímavosti a fakty">
          <ul className="list-disc list-inside space-y-2 text-blue-100/90 text-sm leading-relaxed">
            <li>Energeticky úsporné novostavby môžu výrazne znížiť dlhodobé prevádzkové náklady.</li>
            <li>Rekonštrukcia v historických zónach často vyžaduje dodatočné povolenia a náklady.</li>
            <li>Trhová cena závisí od lokality a dostupnosti – zostatková hodnota nie je garantovaná.</li>
          </ul>
        </Card>
        <Card icon={<Shield className="w-5 h-5 text-emerald-400" />} title="Tipy pre majiteľov">
          <ul className="list-disc list-inside space-y-2 text-blue-100/90 text-sm leading-relaxed">
            <li>Zvážte audit energetickej náročnosti a dotácie, ktoré môžu zlepšiť návratnosť.</li>
            <li>Poistite sa proti nečakaným udalostiam počas výstavby alebo rekonštrukcie.</li>
            <li>Pracujte s rezervou v rozpočte a sledujte harmonogram prác.</li>
          </ul>
        </Card>
      </div>
    </section>
  );
};

const Card = ({ title, icon, children }) => (
  <motion.div
    initial={{ y: 10, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    className="bg-slate-800/60 border border-white/10 rounded-2xl p-5"
  >
    <div className="flex items-center gap-2 text-white font-semibold mb-3">{icon} {title}</div>
    {children}
  </motion.div>
);

export default FooterInfo;
