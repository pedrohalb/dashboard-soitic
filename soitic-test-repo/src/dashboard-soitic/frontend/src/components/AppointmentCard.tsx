import type { Agendamento } from '../types';
import {
  statusConfig,
  tipoConfig,
  formatTime,
  formatDate,
  getInitials,
  getAvatarColor,
} from '../utils/appointmentUtils';

interface Props {
  appointment: Agendamento;
}

export function AppointmentCard({ appointment }: Props) {
  const status = statusConfig[appointment.status] ?? {
    label: appointment.status,
    bg: 'bg-[#eceef0]',
    text: 'text-[#40484f]',
  };
  const tipoInfo = tipoConfig[appointment.tipo] ?? { icon: 'event' };
  const initials = getInitials(appointment.nomePaciente);
  const avatarColor = getAvatarColor(appointment.nomePaciente);

  return (
    <div
      className="p-4 rounded-xl flex items-center gap-4 border border-transparent hover:border-primary-500 transition-colors cursor-pointer bg-surface-hover"
    >
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${avatarColor}`}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-sm truncate font-body text-text-primary"
        >
          {appointment.nomePaciente}
        </p>
        <p
          className="text-xs flex items-center gap-1 mt-0.5 font-body text-text-secondary"
        >
          <span className="material-symbols-outlined text-[14px]">
            {tipoInfo.icon}
          </span>
          <span className="capitalize">{appointment.tipo}</span>
        </p>
      </div>

      {/* Time & Status */}
      <div className="text-right flex-shrink-0">
        <p
          className="font-extrabold text-sm font-headline text-primary-500"
        >
          {formatDate(appointment.dataAgendamento)} &middot; {formatTime(appointment.dataAgendamento)}
        </p>
        <span
          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full mt-1 ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
