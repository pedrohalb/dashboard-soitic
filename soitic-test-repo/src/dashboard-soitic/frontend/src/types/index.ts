export type StatusAgendamento =
  | "confirmado"
  | "pendente"
  | "cancelado"
  | "em espera"
  | "a caminho"
  | "atrasado";

export type TipoAgendamento =
  | "primeira consulta"
  | "retorno"
  | "exame"
  | "urgência";

export interface Agendamento {
  id: number;
  nomePaciente: string;
  dataAgendamento: string;
  status: StatusAgendamento;
  tipo: TipoAgendamento;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DashboardStats {
  todayAppointments: number;
  newPatients: number;
  pendingCount: number;
  cancelledCount: number;
  attendanceRate: number;
  total: number;
}

export interface VolumeData {
  date: string;
  count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AppointmentFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  tipo: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface CriarAgendamentoDto {
  nomePaciente: string;
  dataAgendamento: string;
  status: StatusAgendamento;
  tipo: TipoAgendamento;
}
