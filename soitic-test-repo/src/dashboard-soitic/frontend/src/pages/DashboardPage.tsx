import { useDashboard } from "../hooks/useDashboard";
import { StatCard } from "../components/StatCard";
import { PatientVolumeChart } from "../components/PatientVolumeChart";
import { UpcomingAppointments } from "../components/UpcomingAppointments";
import { InsightsCard } from "../components/InsightsCard";

const today = new Date().toLocaleDateString("pt-BR", {
  day: "numeric",
  month: "long",
});

export function DashboardPage() {
  const { stats, weeklyVolume, upcoming, loading, error, monthlyVolume } =
    useDashboard();

  return (
    <div className="p-6 md:p-10 space-y-8 pb-24 md:pb-10">
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-error/10 text-error border border-error/20">
          <span className="material-symbols-outlined text-xl">error</span>
          <p className="text-sm font-medium font-body">{error}</p>
        </div>
      )}

      {/* Cabeçalho com Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight font-headline text-text-primary">
            Bem-vinda, Dra. Miller
          </h2>
          <p className="mt-1 text-base font-body text-text-secondary">
            Aqui está o resumo clínico para o dia de hoje, {today}.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Consultas Hoje"
          value={loading ? "—" : (stats?.todayAppointments ?? 0)}
          icon="stethoscope"
          iconClass="text-primary-500 bg-primary-500/10"
          sub={
            <div className="flex items-center justify-between w-full text-text-secondary">
              <span>Até o fim do dia</span>
              {stats?.total ? (
                <span className="font-semibold text-text-primary">
                  {stats.total} total
                </span>
              ) : null}
            </div>
          }
        />
        <StatCard
          label="Novos Pacientes"
          value={loading ? "—" : (stats?.newPatients ?? 0)}
          icon="person_add"
          iconClass="text-secondary-500 bg-secondary-500/10"
          sub={
            <span className="text-text-secondary">
              Agendados para esta semana
            </span>
          }
        />
        <StatCard
          label="Atendimentos Pendentes"
          value={loading ? "—" : (stats?.pendingCount ?? 0)}
          icon="pending_actions"
          iconClass="text-warning bg-warning/10"
          sub={
            stats?.pendingCount && stats.pendingCount > 0 ? (
              <span className="text-warning flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">
                  warning
                </span>
                Requer atenção
              </span>
            ) : (
              <span className="text-text-secondary">Nenhum pendente</span>
            )
          }
        />
        <StatCard
          label="Taxa de Comparecimento"
          value={loading ? "—" : `${stats?.attendanceRate ?? 0}%`}
          icon="check_circle"
          iconClass="text-success bg-success/10"
          tooltip="Percentual de pacientes que compareceram às consultas agendadas em relação ao total de agendamentos."
          sub={
            <div className="flex justify-between w-full text-text-secondary">
              <span>Média geral</span>
              {stats?.cancelledCount ? (
                <span className="text-error font-medium">
                  {stats.cancelledCount} Cancelados
                </span>
              ) : null}
            </div>
          }
        />
      </div>

      {/* Chart + Upcoming — grid assimétrico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2" style={{ height: "380px" }}>
          <PatientVolumeChart
            weeklyData={weeklyVolume}
            monthlyData={monthlyVolume}
          />
        </div>
        <div>
          <UpcomingAppointments appointments={upcoming} />
        </div>
      </div>

      {/* Insights */}
      <InsightsCard />
    </div>
  );
}
