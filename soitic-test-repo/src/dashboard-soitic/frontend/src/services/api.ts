import axios from 'axios';
import type {
  Appointment,
  DashboardStats,
  VolumeData,
  CreateAppointmentDto,
} from '../types';
import {
  mockAppointments,
  mockStats,
  mockVolumeData,
} from '../data/mockData';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Fallback para mock quando backend não está disponível
async function withFallback<T>(
  apiCall: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await apiCall();
  } catch {
    console.warn('Backend indisponível — usando dados simulados.');
    return fallback;
  }
}

export const appointmentsApi = {
  getAll: () =>
    withFallback(
      async () => {
        const res = await api.get<Appointment[]>('/appointments');
        return res.data;
      },
      mockAppointments,
    ),

  getStats: () =>
    withFallback(
      async () => {
        const res = await api.get<DashboardStats>('/appointments/stats');
        return res.data;
      },
      mockStats,
    ),

  getVolumeData: () =>
    withFallback(
      async () => {
        const res = await api.get<VolumeData[]>('/appointments/weekly-volume');
        return res.data;
      },
      mockVolumeData,
    ),

  getMonthlyVolume: () =>
    withFallback(
      async () => {
        const res = await api.get<VolumeData[]>('/appointments/monthly-volume');
        return res.data;
      },
      [], // fallback vazio, sem mock fake
    ),

  getUpcoming: (limit = 100) =>
    withFallback(
      async () => {
        const res = await api.get<Appointment[]>(
          `/appointments/upcoming?limit=${limit}`,
        );
        return res.data;
      },
      mockAppointments.slice(0, limit),
    ),

  create: async (dto: CreateAppointmentDto): Promise<Appointment> => {
    const res = await api.post<Appointment>('/appointments', dto);
    return res.data;
  },

  update: async (
    id: number,
    dto: Partial<CreateAppointmentDto>,
  ): Promise<Appointment> => {
    const res = await api.patch<Appointment>(`/appointments/${id}`, dto);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};
