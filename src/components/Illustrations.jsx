import React from "react";

export const NewHouseSVG = ({ className = "w-56 h-40" }) => (
  <svg viewBox="0 0 300 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <rect x="10" y="90" width="280" height="110" rx="14" fill="rgba(15,23,42,0.7)" stroke="rgba(255,255,255,0.1)" />
    <path d="M20 100 L150 20 L280 100" stroke="url(#roofGrad)" strokeWidth="14" fill="none" strokeLinecap="round" />
    <rect x="55" y="130" width="60" height="70" rx="6" fill="#0ea5e9" opacity="0.3" />
    <rect x="125" y="130" width="60" height="70" rx="6" fill="#34d399" opacity="0.25" />
    <rect x="195" y="130" width="60" height="70" rx="6" fill="#a78bfa" opacity="0.25" />
    <rect x="135" y="150" width="40" height="50" rx="6" fill="#1f2937" stroke="rgba(255,255,255,0.12)" />
  </svg>
);

export const RenovationSVG = ({ className = "w-56 h-40" }) => (
  <svg viewBox="0 0 300 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="toolGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    <rect x="10" y="50" width="130" height="150" rx="14" fill="rgba(15,23,42,0.7)" stroke="rgba(255,255,255,0.1)" />
    <rect x="160" y="50" width="130" height="150" rx="14" fill="rgba(15,23,42,0.7)" stroke="rgba(255,255,255,0.1)" />
    <path d="M70 60 L70 190" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
    <path d="M200 70 L260 130" stroke="url(#toolGrad)" strokeWidth="12" strokeLinecap="round" />
    <circle cx="215" cy="85" r="14" fill="#f59e0b" opacity="0.8" />
    <rect x="40" y="130" width="60" height="30" rx="6" fill="#ef4444" opacity="0.35" />
  </svg>
);
