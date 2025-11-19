import React from "react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(1200px_600px_at_-10%_-10%,rgba(59,130,246,0.25),transparent_60%),radial-gradient(800px_400px_at_120%_10%,rgba(16,185,129,0.2),transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10 lg:pt-24 lg:pb-14">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-center">
          Porovnanie: Nový dom vs. Rekonštrukcia
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-center text-base sm:text-lg text-blue-100/90 leading-relaxed">
          Táto stránka vám pomôže rýchlo a prehľadne porovnať dve investičné možnosti – výstavbu nového domu a rekonštrukciu existujúcej nehnuteľnosti. Zadajte vstupné údaje, my vypočítame čistú súčasnú hodnotu (NPV) a ukážeme, ktorá možnosť je finančne výhodnejšia.
        </p>
        <div className="mt-6 max-w-3xl mx-auto text-sm sm:text-base text-blue-100/90 bg-slate-800/60 border border-white/10 rounded-xl p-5 backdrop-blur">
          <h3 className="font-semibold text-white mb-2">Rýchle vysvetlenie pojmov</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <span className="font-medium text-white">Diskontná miera</span> je percento, ktorým sa prepočítavajú budúce náklady alebo príjmy na ich dnešnú hodnotu.
            </li>
            <li>
              <span className="font-medium text-white">Zostatková hodnota</span> je odhadovaná cena nehnuteľnosti na konci zvoleného časového obdobia.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
