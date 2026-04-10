import { useState } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconClass?: string;
  sub?: React.ReactNode;
  tooltip?: string;
}

export function StatCard({ label, value, icon, iconClass, sub, tooltip }: StatCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="editorial-shadow rounded-xl p-6 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default group bg-surface border border-border-subtle"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p
              className="text-sm font-medium transition-colors group-hover:text-text-primary text-text-secondary font-body"
            >
              {label}
            </p>
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip((v) => !v)}
                  className="text-text-muted hover:text-text-secondary transition-colors"
                  aria-label="Mais informações"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-text-primary text-surface text-xs font-body leading-relaxed shadow-lg z-50">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-primary" />
                  </div>
                )}
              </div>
            )}
          </div>
          <p
            className="text-4xl font-extrabold mt-1 tracking-tight font-headline text-text-primary"
          >
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconClass || ''}`}
        >
          <span className="material-symbols-outlined text-2xl">
            {icon}
          </span>
        </div>
      </div>
      {sub && (
        <div className="text-xs mt-1 font-body">
          {sub}
        </div>
      )}
    </div>
  );
}
