import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, TrendingUp, Info, RefreshCcw, HelpCircle, BarChart3, Percent } from "lucide-react";

// Utility: compute present value of a series of annual costs and a terminal value
function npvOfScenario({ initialCost, annualCost, years, residualValue, discountRate }) {
  const r = discountRate / 100; // convert % to decimal
  let npv = -initialCost;
  for (let t = 1; t <= years; t++) {
    npv += -annualCost / Math.pow(1 + r, t);
  }
  if (residualValue && years > 0) {
    npv += residualValue / Math.pow(1 + r, years);
  }
  return npv;
}

function cumulativeSeries({ initialCost, annualCost, years }) {
  const arr = [initialCost];
  let total = initialCost;
  for (let i = 1; i <= years; i++) {
    total += annualCost;
    arr.push(total);
  }
  return arr;
}

function cashflowSeries({ initialCost, annualCost, years, residualValue }) {
  // Year 0: -initialCost, Years 1..N: -annualCost, Year N: +residualValue
  const flows = [ -initialCost ];
  for (let t = 1; t <= years; t++) {
    flows.push(-annualCost + (t === years ? residualValue : 0));
  }
  return flows;
}

const Tooltip = ({ text }) => (
  <div className="group inline-flex items-center gap-1">
    <HelpCircle className="w-4 h-4 text-blue-300/80" />
    <span className="invisible group-hover:visible absolute z-10 mt-8 max-w-xs rounded-md border border-white/10 bg-slate-900/95 px-3 py-2 text-xs text-blue-100 shadow-lg">
      {text}
    </span>
  </div>
);

const NumberInput = ({ label, value, onChange, min = 0, step = 1, suffix = "€", tooltip }) => (
  <label className="block">
    <span className="text-sm text-blue-100 flex items-center gap-2">{label}{tooltip && <Tooltip text={tooltip} />}</span>
    <div className="mt-1 flex items-center gap-2">
      <input
        type="number"
        className="w-full rounded-lg bg-slate-800/60 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60"
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="text-blue-200/80 text-sm whitespace-nowrap">{suffix}</span>
    </div>
  </label>
);

const Calculator = () => {
  const [discountRate, setDiscountRate] = useState(5);

  // New build
  const [buildTotalCost, setBuildTotalCost] = useState(250000);
  const [buildAnnualOps, setBuildAnnualOps] = useState(1800);
  const [buildYears, setBuildYears] = useState(20);
  const [buildResidual, setBuildResidual] = useState(200000);

  // Renovation
  const [renoPurchase, setRenoPurchase] = useState(160000);
  const [renoRenovation, setRenoRenovation] = useState(90000);
  const [renoAnnualOps, setRenoAnnualOps] = useState(2400);
  const [renoResidual, setRenoResidual] = useState(170000);

  const years = buildYears; // shared horizon

  const build = useMemo(() => {
    return {
      npv: npvOfScenario({
        initialCost: buildTotalCost,
        annualCost: buildAnnualOps,
        years,
        residualValue: buildResidual,
        discountRate,
      }),
      cumulative: cumulativeSeries({ initialCost: buildTotalCost, annualCost: buildAnnualOps, years }),
      cashflow: cashflowSeries({ initialCost: buildTotalCost, annualCost: buildAnnualOps, years, residualValue: buildResidual }),
    };
  }, [buildTotalCost, buildAnnualOps, buildResidual, years, discountRate]);

  const renoInitial = renoPurchase + renoRenovation;
  const reno = useMemo(() => {
    return {
      npv: npvOfScenario({
        initialCost: renoInitial,
        annualCost: renoAnnualOps,
        years,
        residualValue: renoResidual,
        discountRate,
      }),
      cumulative: cumulativeSeries({ initialCost: renoInitial, annualCost: renoAnnualOps, years }),
      cashflow: cashflowSeries({ initialCost: renoInitial, annualCost: renoAnnualOps, years, residualValue: renoResidual }),
    };
  }, [renoInitial, renoAnnualOps, renoResidual, years, discountRate]);

  const better = build.npv === reno.npv ? "Rovnaké" : build.npv < reno.npv ? "Nový dom" : "Rekonštrukcia";

  const roiBuild = ((buildResidual - buildTotalCost) / buildTotalCost) * 100;
  const roiReno = ((renoResidual - renoInitial) / renoInitial) * 100;

  const maxYear = years;
  const labels = Array.from({ length: maxYear + 1 }, (_, i) => i);
  const maxVal = Math.max(...build.cumulative, ...reno.cumulative);

  function formatCurrency(v) {
    return new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
  }

  // Exports: expose simple CSV/PDF hooks for Hero buttons
  useEffect(() => {
    window.__exportCSV = () => {
      const rows = [
        ["Metrika", "Nový dom", "Rekonštrukcia"],
        ["NPV", build.npv, reno.npv],
        ["ROI %", roiBuild.toFixed(2), roiReno.toFixed(2)],
      ];
      const csv = rows.map(r => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "porovnanie-investicii.csv";
      a.click();
      URL.revokeObjectURL(url);
    };
    window.__exportPDF = () => {
      // Simple print-to-PDF via browser
      window.print();
    };
    return () => {
      delete window.__exportCSV;
      delete window.__exportPDF;
    };
  }, [build.npv, reno.npv, roiBuild, roiReno]);

  const resetAll = () => {
    setDiscountRate(5);
    setBuildTotalCost(250000);
    setBuildAnnualOps(1800);
    setBuildYears(20);
    setBuildResidual(200000);
    setRenoPurchase(160000);
    setRenoRenovation(90000);
    setRenoAnnualOps(2400);
    setRenoResidual(170000);
  };

  return (
    <section className="relative py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white font-semibold"><CalcIcon className="w-5 h-5 text-blue-400" /> Spoločné nastavenia</div>
              <button onClick={resetAll} className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white"><RefreshCcw className="w-3.5 h-3.5" /> Reset</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Diskontná miera" value={discountRate} onChange={setDiscountRate} step={0.1} suffix="%" tooltip="Percento, ktorým prepočítame budúce hodnoty na dnešné." />
              <NumberInput label="Dĺžka horizontu" value={buildYears} onChange={setBuildYears} step={1} suffix="rokov" tooltip="Počet rokov, počas ktorých sledujeme náklady a zostatkovú hodnotu." />
            </div>
            <p className="mt-3 text-xs text-blue-200/70">Príklad: 3 % diskont ≈ 1000 € o rok je dnes ~970 €.</p>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold mb-2"><TrendingUp className="w-5 h-5 text-blue-400" /> Nový dom</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Celková cena výstavby" value={buildTotalCost} onChange={setBuildTotalCost} step={1000} tooltip="Všetky počiatočné náklady na výstavbu." />
              <NumberInput label="Ročné prevádzkové náklady" value={buildAnnualOps} onChange={setBuildAnnualOps} step={100} tooltip="Energia, údržba, poistenie a pod." />
              <NumberInput label="Zostatková hodnota" value={buildResidual} onChange={setBuildResidual} step={1000} tooltip="Odhad ceny nehnuteľnosti na konci horizontu." />
            </div>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold mb-2"><TrendingUp className="w-5 h-5 text-emerald-400" /> Rekonštrukcia</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Obstarávacia cena" value={renoPurchase} onChange={setRenoPurchase} step={1000} tooltip="Cena existujúcej nehnuteľnosti." />
              <NumberInput label="Cena rekonštrukcie" value={renoRenovation} onChange={setRenoRenovation} step={1000} tooltip="Súčet prác a materiálu na rekonštrukciu." />
              <NumberInput label="Ročné prevádzkové náklady" value={renoAnnualOps} onChange={setRenoAnnualOps} step={100} tooltip="Energia, údržba, poistenie a pod." />
              <NumberInput label="Zostatková hodnota" value={renoResidual} onChange={setRenoResidual} step={1000} tooltip="Odhad ceny po rekonštrukcii na konci horizontu." />
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold"><Info className="w-5 h-5 text-amber-400" /> Výsledky</div>
            <div className="mt-4 grid sm:grid-cols-4 gap-4">
              <Stat label="NPV – Nový dom" value={build.npv} format={formatCurrency} accent="blue" />
              <Stat label="NPV – Rekonštrukcia" value={reno.npv} format={formatCurrency} accent="emerald" />
              <Stat label="ROI – Nový dom" value={roiBuild} format={(v)=>`${v.toFixed(1)} %`} accent="blue" />
              <Stat label="ROI – Rekonštrukcia" value={roiReno} format={(v)=>`${v.toFixed(1)} %`} accent="emerald" />
            </div>
            <div className="mt-3 rounded-xl bg-slate-900/40 border border-white/10 p-4 text-sm text-blue-200/85">
              Výhodnejšia možnosť: <span className="font-semibold text-white">{better}</span>
            </div>

            <div className="mt-6 space-y-6">
              <Chart labels={labels} seriesA={build.cumulative} seriesB={reno.cumulative} maxVal={maxVal} />
              <CashflowChart flowsA={build.cashflow} flowsB={reno.cashflow} />
            </div>
          </motion.div>

          <Sensitivity discountRate={discountRate} setDiscountRate={setDiscountRate} build={{ initial: buildTotalCost, annual: buildAnnualOps, residual: buildResidual }} reno={{ initial: renoInitial, annual: renoAnnualOps, residual: renoResidual }} years={years} />

          <AdviceSwitcher />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value, format, accent = "blue" }) => (
  <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
    <p className="text-sm text-blue-200/80">{label}</p>
    <p className={`text-2xl font-semibold text-white`}>{format(value)}</p>
    <div className="mt-3 h-1 rounded-full bg-white/10">
      <div className={`h-full w-2/3 rounded-full ${accent === "blue" ? "bg-blue-500" : "bg-emerald-500"}`} />
    </div>
  </div>
);

const Tips = () => (
  <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
    <h3 className="text-white font-semibold mb-3">Rady a poznámky</h3>
    <ul className="space-y-2 text-blue-100/90 text-sm leading-relaxed">
      <li>Porovnávajte aj nefinančné faktory: lokalita, dispozícia, energetická trieda, dostupnosť služieb.</li>
      <li>Vyššie počiatočné náklady môžu byť kompenzované nižšími prevádzkovými nákladmi v dlhšom horizonte.</li>
      <li>Pri zostatkovej hodnote zohľadnite opotrebenie, potenciál lokality a stav trhu.</li>
      <li>Skúste si prejsť citlivosť: zmeňte diskontnú mieru o ±1–2 p.b. a sledujte dopad na NPV.</li>
      <li>Nepodceňujte rezervu na nečakané výdavky (aspoň 10 % z rozpočtu).</li>
    </ul>
  </motion.div>
);

const Chart = ({ labels, seriesA, seriesB, maxVal }) => {
  const pad = 36;
  const w = 760;
  const h = 320;

  const scaleX = (i) => pad + (i / (labels.length - 1)) * (w - 2 * pad);
  const scaleY = (v) => {
    const m = maxVal === 0 ? 1 : maxVal;
    return h - pad - (v / m) * (h - 2 * pad);
    };

  const pathFrom = (data) => data.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`).join(" ");

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-slate-900/40 border border-white/10 p-3">
      <div className="text-sm text-blue-200/85 mb-2 inline-flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Kumulatívne nominálne náklady</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[560px]">
        <defs>
          <linearGradient id="gradA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} />
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} />
        </g>

        {labels.map((_, i) => (
          <line key={i} x1={scaleX(i)} y1={pad} x2={scaleX(i)} y2={h - pad} stroke="rgba(255,255,255,0.06)" />
        ))}

        <motion.path d={pathFrom(seriesA)} fill="none" stroke="#60a5fa" strokeWidth="2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
        <path d={`${pathFrom(seriesA)} L ${scaleX(seriesA.length - 1)} ${h - pad} L ${scaleX(0)} ${h - pad} Z`} fill="url(#gradA)" />

        <motion.path d={pathFrom(seriesB)} fill="none" stroke="#34d399" strokeWidth="2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 }} />
        <path d={`${pathFrom(seriesB)} L ${scaleX(seriesB.length - 1)} ${h - pad} L ${scaleX(0)} ${h - pad} Z`} fill="url(#gradB)" />

        {labels.map((label, i) => (
          <text key={i} x={scaleX(i)} y={h - pad + 18} textAnchor="middle" className="fill-blue-200" fontSize="10">
            {label}
          </text>
        ))}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-blue-200/80">
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block" /> Nový dom</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" /> Rekonštrukcia</span>
      </div>
    </div>
  );
};

const CashflowChart = ({ flowsA, flowsB }) => {
  const pad = 36, w = 760, h = 300;
  const labels = flowsA.map((_, i) => i);
  const minVal = Math.min(...flowsA, ...flowsB);
  const maxVal = Math.max(...flowsA, ...flowsB);
  const scaleX = (i) => pad + (i / (labels.length - 1)) * (w - 2 * pad);
  const scaleY = (v) => {
    const range = maxVal - minVal || 1;
    return h - pad - ((v - minVal) / range) * (h - 2 * pad);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-slate-900/40 border border-white/10 p-3">
      <div className="text-sm text-blue-200/85 mb-2 inline-flex items-center gap-2"><Percent className="w-4 h-4" /> Cashflow po rokoch</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[560px]">
        <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} />
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} />
        </g>
        {labels.map((_, i) => (
          <line key={i} x1={scaleX(i)} y1={pad} x2={scaleX(i)} y2={h - pad} stroke="rgba(255,255,255,0.06)" />
        ))}
        {labels.map((year, i) => (
          <g key={i}>
            <circle cx={scaleX(i)} cy={scaleY(flowsA[i])} r={4} fill="#60a5fa" />
            <circle cx={scaleX(i)} cy={scaleY(flowsB[i])} r={4} fill="#34d399" />
          </g>
        ))}
        {labels.map((year, i) => (
          <text key={`lbl-${i}`} x={scaleX(i)} y={h - pad + 18} textAnchor="middle" className="fill-blue-200" fontSize="10">{year}</text>
        ))}
      </svg>
      <div className="mt-2 text-xs text-blue-200/70">Záporné hodnoty = výdavky, kladné = príjmy (napr. zostatková hodnota v poslednom roku).</div>
    </div>
  );
};

const Sensitivity = ({ discountRate, setDiscountRate, build, reno, years }) => {
  const steps = [-20, -10, 0, 10, 20];

  const compute = (deltaPct) => {
    const r = Math.max(0.1, discountRate * (1 + deltaPct / 100));
    const buildNPV = npvOfScenario({ initialCost: build.initial, annualCost: build.annual, years, residualValue: build.residual, discountRate: r });
    const renoNPV = npvOfScenario({ initialCost: reno.initial, annualCost: reno.annual, years, residualValue: reno.residual, discountRate: r });
    return { r, buildNPV, renoNPV };
  };

  const results = steps.map((s) => compute(s));
  const minVal = Math.min(...results.flatMap((r) => [r.buildNPV, r.renoNPV]));
  const maxVal = Math.max(...results.flatMap((r) => [r.buildNPV, r.renoNPV]));

  const scale = (v) => {
    if (maxVal === minVal) return 50;
    return 8 + ((v - minVal) / (maxVal - minVal)) * 84;
  };

  return (
    <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Citlivostná analýza (±20 %)</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-200/80">Diskont:</span>
          <input type="range" min={0.1} max={15} step={0.1} value={discountRate} onChange={(e)=>setDiscountRate(Number(e.target.value))} className="w-40" />
          <span className="text-white font-medium">{discountRate.toFixed(1)} %</span>
        </div>
      </div>
      <div className="grid sm:grid-cols-5 gap-3">
        {results.map((r, idx) => (
          <div key={idx} className="rounded-xl bg-slate-900/40 border border-white/10 p-3">
            <div className="text-xs text-blue-200/70 mb-2">Diskont {steps[idx] >= 0 ? "+" : ""}{steps[idx]} %</div>
            <div className="flex items-end gap-2 h-24">
              <div className="flex-1">
                <div className="h-full w-4 mx-auto rounded bg-blue-500" style={{ height: scale(r.buildNPV) + "%" }} />
                <div className="text-[10px] mt-1 text-center text-blue-200/80">Nový dom</div>
              </div>
              <div className="flex-1">
                <div className="h-full w-4 mx-auto rounded bg-emerald-500" style={{ height: scale(r.renoNPV) + "%" }} />
                <div className="text-[10px] mt-1 text-center text-blue-200/80">Reko</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AdviceSwitcher = () => {
  const [mode, setMode] = useState("majitel");
  const tipsMajitel = [
    "Investuj do energeticky efektívnych riešení – znížiš ročné náklady.",
    "Skontroluj stav budovy pred rekonštrukciou.",
    "Pri výstavbe zváž lokalitu a budúce trendy.",
  ];
  const tipsInvestor = [
    "Zameraj sa na cashflow a udržateľnosť nákladov.",
    "Diverzifikuj riziká – nespoliehaj sa na jeden scenár.",
    "Sleduj dotačné programy a úrokové prostredie.",
  ];
  const tips = mode === "majitel" ? tipsMajitel : tipsInvestor;

  return (
    <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Tipy podľa typu používateľa</h3>
        <div className="inline-flex rounded-lg border border-white/10 p-1 bg-slate-900/40">
          <button onClick={()=>setMode("majitel")} className={`px-3 py-1 text-sm rounded-md ${mode === "majitel" ? "bg-white/15 text-white" : "text-blue-200/80"}`}>Majiteľ domu</button>
          <button onClick={()=>setMode("investor")} className={`px-3 py-1 text-sm rounded-md ${mode === "investor" ? "bg-white/15 text.white" : "text-blue-200/80"}`}>Investor</button>
        </div>
      </div>
      <ul className="grid sm:grid-cols-3 gap-3">
        {tips.map((t, i) => (
          <li key={i} className="rounded-xl bg-slate-900/40 border border-white/10 p-3 text-sm text-blue-100/90">{t}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Calculator;
