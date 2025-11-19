import React, { useMemo, useState } from "react";

// Utility: compute present value of a series of annual costs and a terminal value
function npvOfScenario({ initialCost, annualCost, years, residualValue, discountRate }) {
  const r = discountRate / 100; // convert % to decimal
  // Cash flow convention: costs are negative, residual value positive
  // initialCost occurs at t=0
  let npv = -initialCost;
  // annual operating costs at end of each year (t=1..years)
  for (let t = 1; t <= years; t++) {
    npv += -annualCost / Math.pow(1 + r, t);
  }
  // residual value received at the end of horizon (t=years)
  if (residualValue && years > 0) {
    npv += residualValue / Math.pow(1 + r, years);
  }
  return npv;
}

function cumulativeSeries({ initialCost, annualCost, years }) {
  // Returns cumulative nominal costs per year (not discounted) for charting
  const arr = [initialCost];
  let total = initialCost;
  for (let i = 1; i <= years; i++) {
    total += annualCost;
    arr.push(total);
  }
  return arr; // length years+1, index = year
}

const NumberInput = ({ label, value, onChange, min = 0, step = 1, suffix = "€" }) => (
  <label className="block">
    <span className="text-sm text-blue-100">{label}</span>
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

  const years = buildYears; // common horizon driven by buildYears

  const build = useMemo(() => {
    return {
      npv: npvOfScenario({
        initialCost: buildTotalCost,
        annualCost: buildAnnualOps,
        years,
        residualValue: buildResidual,
        discountRate,
      }),
      cumulative: cumulativeSeries({
        initialCost: buildTotalCost,
        annualCost: buildAnnualOps,
        years,
      }),
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
      cumulative: cumulativeSeries({
        initialCost: renoInitial,
        annualCost: renoAnnualOps,
        years,
      }),
    };
  }, [renoInitial, renoAnnualOps, renoResidual, years, discountRate]);

  const better = build.npv === reno.npv ? "Rovnaké" : build.npv < reno.npv ? "Nový dom" : "Rekonštrukcia";

  // Prepare data for simple SVG chart
  const maxYear = years;
  const labels = Array.from({ length: maxYear + 1 }, (_, i) => i);
  const maxVal = Math.max(
    ...build.cumulative,
    ...reno.cumulative
  );

  function formatCurrency(v) {
    return new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
  }

  return (
    <section className="relative py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Spoločné nastavenia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Diskontná miera" value={discountRate} onChange={setDiscountRate} step={0.1} suffix="%" />
              <NumberInput label="Dĺžka horizontu" value={buildYears} onChange={setBuildYears} step={1} suffix="rokov" />
            </div>
            <p className="mt-3 text-xs text-blue-200/70">Vyššia diskontná miera znižuje dnešnú hodnotu budúcich nákladov aj zostatkovej hodnoty.</p>
          </div>

          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Nový dom</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Celková cena výstavby" value={buildTotalCost} onChange={setBuildTotalCost} step={1000} />
              <NumberInput label="Ročné prevádzkové náklady" value={buildAnnualOps} onChange={setBuildAnnualOps} step={100} />
              <NumberInput label="Zostatková hodnota" value={buildResidual} onChange={setBuildResidual} step={1000} />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Rekonštrukcia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Obstarávacia cena" value={renoPurchase} onChange={setRenoPurchase} step={1000} />
              <NumberInput label="Cena rekonštrukcie" value={renoRenovation} onChange={setRenoRenovation} step={1000} />
              <NumberInput label="Ročné prevádzkové náklady" value={renoAnnualOps} onChange={setRenoAnnualOps} step={100} />
              <NumberInput label="Zostatková hodnota" value={renoResidual} onChange={setRenoResidual} step={1000} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold">Výsledky</h3>
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
                <p className="text-sm text-blue-200/80">NPV – Nový dom</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(build.npv)}</p>
              </div>
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
                <p className="text-sm text-blue-200/80">NPV – Rekonštrukcia</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(reno.npv)}</p>
              </div>
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
                <p className="text-sm text-blue-200/80">Výhodnejšia možnosť</p>
                <p className="text-2xl font-semibold text-white">{better}</p>
              </div>
            </div>

            <div className="mt-6">
              <Chart labels={labels} seriesA={build.cumulative} seriesB={reno.cumulative} maxVal={maxVal} />
              <p className="text-xs text-blue-200/70 mt-2">Graf zobrazuje kumulatívne nominálne náklady v čase (bez diskontovania).</p>
            </div>
          </div>

          <Tips />
        </div>
      </div>
    </section>
  );
};

const Tips = () => (
  <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
    <h3 className="text-white font-semibold mb-3">Rady a poznámky</h3>
    <ul className="space-y-2 text-blue-100/90 text-sm leading-relaxed">
      <li>Porovnávajte aj nefinančné faktory: lokalita, dispozícia, energetická trieda, dostupnosť služieb.</li>
      <li>Vyššie počiatočné náklady môžu byť kompenzované nižšími prevádzkovými nákladmi v dlhšom horizonte.</li>
      <li>Pri zostatkovej hodnote zohľadnite opotrebenie, potenciál lokality a stav trhu.</li>
      <li>Skúste si prejsť citlivosť: zmeňte diskontnú mieru o ±1–2 p.b. a sledujte dopad na NPV.</li>
      <li>Nepodceňujte rezervu na nečakané výdavky (aspoň 10 % z rozpočtu).</li>
    </ul>
  </div>
);

const Chart = ({ labels, seriesA, seriesB, maxVal }) => {
  // Simple responsive SVG line chart
  const pad = 32;
  const w = 700;
  const h = 300;

  const scaleX = (i) => pad + (i / (labels.length - 1)) * (w - 2 * pad);
  const scaleY = (v) => {
    const m = maxVal === 0 ? 1 : maxVal;
    return h - pad - (v / m) * (h - 2 * pad);
  };

  const pathFrom = (data) =>
    data
      .map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`)
      .join(" ");

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-slate-900/40 border border-white/10 p-3">
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

        {/* Axes */}
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
          {/* x axis */}
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} />
          {/* y axis */}
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} />
        </g>

        {/* Grid */}
        {labels.map((_, i) => (
          <line key={i} x1={scaleX(i)} y1={pad} x2={scaleX(i)} y2={h - pad} stroke="rgba(255,255,255,0.06)" />
        ))}

        {/* Series A - Build */}
        <path d={pathFrom(seriesA)} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
        <path d={`${pathFrom(seriesA)} L ${scaleX(seriesA.length - 1)} ${h - pad} L ${scaleX(0)} ${h - pad} Z`} fill="url(#gradA)" />

        {/* Series B - Reno */}
        <path d={pathFrom(seriesB)} fill="none" stroke="#34d399" strokeWidth="2.5" />
        <path d={`${pathFrom(seriesB)} L ${scaleX(seriesB.length - 1)} ${h - pad} L ${scaleX(0)} ${h - pad} Z`} fill="url(#gradB)" />

        {/* Labels */}
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

export default Calculator;
