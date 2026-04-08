import type { Appointment } from '../types';
import { AppointmentCard } from './AppointmentCard';

interface Props {
  appointments: Appointment[];
}

export function UpcomingAppointments({ appointments }: Props) {
  return (
    <div
      className="editorial-shadow p-8 rounded-xl bg-surface border border-border-subtle flex flex-col h-[380px]"
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          className="text-xl font-extrabold tracking-tight font-headline text-text-primary"
        >
          Próximos Agendamentos
        </h3>
        <button
          className="text-xs font-bold hover:underline font-body text-primary-500"
        >
          Ver Todos
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {appointments.length === 0 ? (
          <p className="text-sm text-center py-8 text-text-muted font-body">
            Nenhum agendamento encontrado.
          </p>
        ) : (
          appointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))
        )}
      </div>
    </div>
  );
}
