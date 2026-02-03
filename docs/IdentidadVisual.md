import React from 'react';
import { Download } from 'lucide-react';

const TonkLogo = ({ className = "w-12 h-12", showText = true, theme = "dark" }) => {
// Colors based on theme
const primaryColor = theme === 'dark' ? '#06b6d4' : '#0891b2'; // Cyan
const secondaryColor = theme === 'dark' ? '#3b82f6' : '#2563eb'; // Blue
const textColor = theme === 'dark' ? '#ffffff' : '#0f172a'; // White/Slate

return (
<div className={`flex items-center gap-3 ${className}`}>
{/_ Isotype / Icon _/}
<svg viewBox="0 0 100 100" className="h-full w-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
{/_ Left Pillar (Legacy/Stability) - Blue _/}
<path d="M20 20 H45 V80 H20 V20 Z" fill={secondaryColor} className="opacity-90" />

        {/* Right Pillar (Future/Cloud) - Cyan */}
        <path d="M55 20 H80 V60 H55 V20 Z" fill={primaryColor} />

        {/* The Bridge / Spark (Connection) */}
        <path d="M45 35 H55 V45 H45 V35 Z" fill="white" />
        <rect x="42" y="32" width="16" height="16" rx="1" stroke={primaryColor} strokeWidth="2" fill="none" />

        {/* Tech Accents */}
        <circle cx="80" cy="20" r="3" fill="white" />
        <rect x="20" y="77" width="25" height="3" fill="white" fillOpacity="0.5" />
      </svg>

      {/* Logotype */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-bold text-2xl tracking-tight leading-none" style={{ color: textColor, fontFamily: 'system-ui, sans-serif' }}>
            TONK
          </span>
          <span className="text-[0.65rem] font-medium tracking-[0.2em] uppercase leading-none mt-1 opacity-80" style={{ color: primaryColor }}>
            Solutions
          </span>
        </div>
      )}
    </div>

);
};

const App = () => {
return (
<div className="min-h-screen bg-slate-950 font-sans text-slate-200 p-8 md:p-16 flex flex-col items-center">

      <div className="max-w-4xl w-full">
        <header className="mb-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Identidad Visual</h1>
          <p className="text-slate-400">Concepto: "El Enlace Estructural"</p>
        </header>

        {/* Main Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Dark Mode (Primary) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <span className="text-xs font-mono text-slate-500">DARK_MODE_DEFAULT</span>
            </div>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
              <TonkLogo className="h-24 w-full" theme="dark" />
            </div>
          </div>

          {/* Light Mode (Documents) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <span className="text-xs font-mono text-slate-400">LIGHT_MODE_DOCS</span>
            </div>

            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
              <TonkLogo className="h-24 w-full" theme="light" />
            </div>
          </div>
        </div>

        {/* Application Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          {/* App Icon */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center gap-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Favicon / App Icon</span>
            <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-700 flex items-center justify-center shadow-lg shadow-cyan-900/20">
               <TonkLogo className="h-10 w-10" showText={false} theme="dark" />
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center gap-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Social Cover</span>
            <div className="w-full h-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-slate-700 flex items-center justify-center relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <TonkLogo className="h-8 w-auto" theme="dark" />
            </div>
          </div>

          {/* Document Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center gap-4">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Membrete PDF</span>
            <div className="w-full h-16 bg-white rounded-lg px-4 flex items-center justify-between border border-slate-100">
               <TonkLogo className="h-6 w-auto" theme="light" />
               <div className="h-2 w-12 bg-slate-100 rounded"></div>
            </div>
          </div>

        </div>

        {/* Rational */}
        <div className="grid md:grid-cols-3 gap-8 text-sm text-slate-400 border-t border-slate-800 pt-8">
          <div>
            <h3 className="text-white font-bold mb-2">Simbolismo</h3>
            <p>Dos pilares verticales (Core y Cloud) unidos por un nodo central brillante (Inteligencia Artificial).</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Geometría</h3>
            <p>Formas rectangulares y sólidas que transmiten estabilidad estructural, esencial para sistemas críticos.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Paleta</h3>
            <p><span className="text-cyan-400">Cian Neón</span> para la innovación y <span className="text-blue-500">Azul Real</span> para la confianza corporativa.</p>
          </div>
        </div>

      </div>
    </div>

);
};

export default App;
