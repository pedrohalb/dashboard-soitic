export function InsightsCard() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Insights — 3 colunas */}
      <div
        className="md:col-span-3 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px] bg-gradient-to-br from-secondary-500 to-primary-500"
      >
        {/* Decorativo */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none flex items-center justify-end">
          <span
            className="material-symbols-outlined text-white select-none"
            style={{ fontSize: 300, marginRight: -60, marginTop: -60, fontVariationSettings: "'FILL' 1" }}
          >
            clinical_notes
          </span>
        </div>

        <div className="relative z-10 max-w-full">
          <h4
            className="text-2xl font-bold mb-2 text-white font-headline"
          >
            Insights da Clínica
          </h4>
          <p
            className="leading-relaxed text-white/90 font-body"
          >
            Sua taxa de retenção de pacientes aumentou 15% este mês. A maioria
            dos novos agendamentos vem de encaminhamentos da oncologia.
          </p>
          <button
            className="mt-6 px-6 py-2 rounded-lg text-sm transition-transform active:scale-95 shadow-xl bg-surface text-primary-500 font-bold hover:bg-surface-hover hover:text-primary-600 border border-border-subtle"
          >
            Ver Relatório Completo
          </button>
        </div>
      </div>
    </section>
  );
}
