interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconClass?: string;
  sub?: React.ReactNode;
}

export function StatCard({ label, value, icon, iconClass, sub }: StatCardProps) {
  return (
    <div
      className="editorial-shadow rounded-xl p-6 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default group bg-surface border border-border-subtle"
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-sm font-medium transition-colors group-hover:text-text-primary text-text-secondary font-body"
          >
            {label}
          </p>
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
