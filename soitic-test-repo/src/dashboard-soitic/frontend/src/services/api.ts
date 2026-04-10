import axios from "axios";
import type {
  Agendamento,
  DashboardStats,
  VolumeData,
  CriarAgendamentoDto,
  PaginatedResponse,
  AppointmentFilters,
} from "../types";
import { mockAgendamentos, mockStats, mockVolumeData } from "../data/mockData";

const api = axios.create({
  baseURL: "/api",
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
    console.warn("Backend indisponível — usando dados simulados.");
    return fallback;
  }
}

export const appointmentsApi = {
  getAll: () =>
    withFallback(async () => {
      const res = await api.get<Agendamento[]>("/appointments");
      return res.data;
    }, mockAgendamentos),

  getStats: () =>
    withFallback(async () => {
      const res = await api.get<DashboardStats>("/appointments/stats");
      return res.data;
    }, mockStats),

  getVolumeData: () =>
    withFallback(async () => {
      const res = await api.get<VolumeData[]>("/appointments/weekly-volume");
      return res.data;
    }, mockVolumeData),

  getMonthlyVolume: () =>
    withFallback(async () => {
      const res = await api.get<VolumeData[]>("/appointments/monthly-volume");
      return res.data;
    }, []),

  getUpcoming: (limit = 100) =>
    withFallback(
      async () => {
        const res = await api.get<Agendamento[]>(
          `/appointments/upcoming?limit=${limit}`,
        );
        return res.data;
      },
      mockAgendamentos.slice(0, limit),
    ),

  create: async (dto: CriarAgendamentoDto): Promise<Agendamento> => {
    const res = await api.post<Agendamento>("/appointments", dto);
    return res.data;
  },

  update: async (
    id: number,
    dto: Partial<CriarAgendamentoDto>,
  ): Promise<Agendamento> => {
    const res = await api.patch<Agendamento>(`/appointments/${id}`, dto);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  getPaginated: (filters: Partial<AppointmentFilters>) =>
    withFallback(
      async () => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== "") {
            params.append(key, String(value));
          }
        }
        const res = await api.get<PaginatedResponse<Agendamento>>(
          `/appointments/paginated?${params.toString()}`,
        );
        return res.data;
      },
      { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    ),
};
