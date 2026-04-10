import { useState, useEffect, useCallback } from "react";
import type { Agendamento, DashboardStats, VolumeData } from "../types";
import { appointmentsApi } from "../services/api";

interface DashboardData {
  stats: DashboardStats | null;
  weeklyVolume: VolumeData[];
  monthlyVolume: VolumeData[];
  upcoming: Agendamento[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weeklyVolume, setVolumeData] = useState<VolumeData[]>([]);
  const [upcoming, setUpcoming] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyVolume, setMonthlyVolume] = useState<VolumeData[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, volumeData, monthlyData, upcomingData] =
        await Promise.all([
          appointmentsApi.getStats(),
          appointmentsApi.getVolumeData(),
          appointmentsApi.getMonthlyVolume(),
          appointmentsApi.getUpcoming(),
        ]);
      setStats(statsData);
      setVolumeData(volumeData);
      setMonthlyVolume(monthlyData);
      setUpcoming(upcomingData);
    } catch (err) {
      setError("Erro ao carregar dados do dashboard.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    stats,
    weeklyVolume,
    monthlyVolume,
    upcoming,
    loading,
    error,
    refetch: fetchAll,
  };
}
