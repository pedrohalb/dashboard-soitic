interface Props {
  title: string;
  icon: string;
  description: string;
}

export function PlaceholderPage({ title, icon, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-10">
      <div
        className="w-24 h-24 rounded-2xl flex items-center justify-center editorial-shadow"
        style={{ backgroundColor: "#cde5ff" }}
      >
        <span
          className="material-symbols-outlined text-5xl"
          style={{ color: "#004b74" }}
        >
          {icon}
        </span>
      </div>
      <div className="text-center max-w-sm">
        <h2
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: "#191c1e", fontFamily: "Manrope, sans-serif" }}
        >
          {title}
        </h2>
        <p
          className="mt-2 text-sm"
          style={{ color: "#40484f", fontFamily: "Inter, sans-serif" }}
        >
          {description}
        </p>
      </div>
      <span
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
        style={{
          backgroundColor: "#d6e4f5",
          color: "#004b74",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <span className="material-symbols-outlined text-sm">construction</span>
        Em desenvolvimento
      </span>
    </div>
  );
}
