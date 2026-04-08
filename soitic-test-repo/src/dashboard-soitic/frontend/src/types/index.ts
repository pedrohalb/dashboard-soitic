export type AppointmentStatus =
  | 'confirmado'
  | 'pendente'
  | 'cancelado'
  | 'em espera'
  | 'a caminho'
  | 'atrasado';

export type AppointmentType =
  | 'primeira consulta'
  | 'retorno'
  | 'exame'
  | 'urgência';

export interface Appointment {
  id: number;
  patientName: string;
  appointmentDate: string;
  status: AppointmentStatus;
  type: AppointmentType;
  createdAt: string;
  updatedAt: string;
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

export interface CreateAppointmentDto {
  patientName: string;
  appointmentDate: string;
  status: AppointmentStatus;
  type: AppointmentType;
}
