import { useEffect, useState } from "react";

export function TopBar() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // force dark mode as default
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-border-subtle transition-colors duration-300">
      {/* Brand — visível apenas no mobile (sidebar está hidden) */}
      <div className="md:hidden">
        <h1 className="font-headline font-extrabold text-lg tracking-tighter bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent whitespace-nowrap">
          Clínica Bem Viver
        </h1>
      </div>

      {/* Spacer desktop */}
      <nav className="hidden md:flex items-center gap-6 mx-8"></nav>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Tema Escuro / Claro Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-surface-hover text-text-secondary"
          title="Alternar Tema"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-surface-hover text-text-secondary">
          <span className="material-symbols-outlined text-xl">
            notifications
          </span>
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-surface-hover text-text-secondary">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        {/* Doctor profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold font-body text-text-primary">
              Dra. Julianne Miller
            </p>
            <p className="text-xs uppercase tracking-widest font-body text-text-muted">
              Endocrinologista
            </p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-secondary-500 to-primary-500 text-white">
            JM
          </div>
        </div>
      </div>
    </header>
  );
}
