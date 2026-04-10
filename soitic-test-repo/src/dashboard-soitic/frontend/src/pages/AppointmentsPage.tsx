import { useState, useEffect, useCallback } from 'react';
import type {
  Agendamento,
  AppointmentFilters,
  PaginatedResponse,
  StatusAgendamento,
  TipoAgendamento,
} from '../types';
import { appointmentsApi } from '../services/api';
import {
  statusConfig,
  tipoConfig,
  formatTime,
  formatDate,
  getInitials,
  getAvatarColor,
} from '../utils/appointmentUtils';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'em espera', label: 'Em Espera' },
  { value: 'a caminho', label: 'A Caminho' },
  { value: 'atrasado', label: 'Atrasado' },
];

const TIPO_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'primeira consulta', label: 'Primeira Consulta' },
  { value: 'retorno', label: 'Retorno' },
  { value: 'exame', label: 'Exame' },
  { value: 'urgência', label: 'Urgência' },
];

const LIMIT_OPTIONS = [10, 20, 50];

const defaultFilters: AppointmentFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  tipo: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'dataAgendamento',
  sortOrder: 'desc',
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ─── Edit Modal ─── */
function EditModal({
  appointment,
  onClose,
  onSaved,
}: {
  appointment: Agendamento;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nomePaciente: appointment.nomePaciente,
    dataAgendamento: toDatetimeLocal(appointment.dataAgendamento),
    status: appointment.status as string,
    tipo: appointment.tipo as string,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await appointmentsApi.update(appointment.id, {
        nomePaciente: form.nomePaciente,
        dataAgendamento: new Date(form.dataAgendamento).toISOString(),
        status: form.status as StatusAgendamento,
        tipo: form.tipo as TipoAgendamento,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-body';
  const selectClass = `${inputClass} custom-select`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-subtle rounded-2xl shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="text-lg font-bold font-headline text-text-primary">
            Editar Agendamento
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-text-muted">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary font-body mb-1">
              Paciente
            </label>
            <input
              type="text"
              value={form.nomePaciente}
              onChange={(e) => setForm((f) => ({ ...f, nomePaciente: e.target.value }))}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary font-body mb-1">
              Data / Hora
            </label>
            <input
              type="datetime-local"
              lang="pt-BR"
              value={form.dataAgendamento}
              onChange={(e) => setForm((f) => ({ ...f, dataAgendamento: e.target.value }))}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary font-body mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={selectClass}
              >
                {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary font-body mb-1">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                className={selectClass}
              >
                {TIPO_OPTIONS.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors font-body"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 transition-colors font-body"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ─── */
function DeleteModal({
  appointment,
  onClose,
  onDeleted,
}: {
  appointment: Agendamento;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await appointmentsApi.remove(appointment.id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-subtle rounded-2xl shadow-xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl text-error">delete_forever</span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline text-text-primary">
              Remover agendamento?
            </h3>
            <p className="mt-1 text-sm text-text-secondary font-body">
              O agendamento de <strong>{appointment.nomePaciente}</strong> sera removido permanentemente.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors font-body"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-error hover:opacity-90 disabled:opacity-50 transition-colors font-body"
            >
              {deleting ? 'Removendo...' : 'Remover'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function AppointmentsPage() {
  const [filters, setFilters] = useState<AppointmentFilters>(defaultFilters);
  const [result, setResult] = useState<PaginatedResponse<Agendamento> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [editing, setEditing] = useState<Agendamento | null>(null);
  const [deleting, setDeleting] = useState<Agendamento | null>(null);

  const fetchData = useCallback(async (f: AppointmentFilters) => {
    setLoading(true);
    const res = await appointmentsApi.getPaginated(f);
    setResult(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  // Debounce da busca por nome
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const updateFilter = (key: keyof AppointmentFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters(defaultFilters);
  };

  const handleSaved = () => {
    setEditing(null);
    fetchData(filters);
  };

  const handleDeleted = () => {
    setDeleting(null);
    fetchData(filters);
  };

  const meta = result?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 };
  const data = result?.data ?? [];
  const hasActiveFilters = filters.search || filters.status || filters.tipo || filters.dateFrom || filters.dateTo;

  const SortIcon = ({ field }: { field: string }) => {
    if (filters.sortBy !== field) return <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-40">unfold_more</span>;
    return (
      <span className="material-symbols-outlined text-[16px] text-primary-500">
        {filters.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-10 space-y-6 pb-24 md:pb-10">
      {/* Modals */}
      {editing && (
        <EditModal
          appointment={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
      {deleting && (
        <DeleteModal
          appointment={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={handleDeleted}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight font-headline text-text-primary">
            Agendamentos
          </h2>
          <p className="mt-1 text-sm font-body text-text-secondary">
            Historico completo de consultas da clinica
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted font-body">
          <span className="material-symbols-outlined text-[18px]">database</span>
          {meta.total} registro{meta.total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border-subtle rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary font-body">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Filtros
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-border-subtle bg-bg-base text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-body"
            />
          </div>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="custom-select px-3 py-2 rounded-lg border border-border-subtle bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-body"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Tipo */}
          <select
            value={filters.tipo}
            onChange={(e) => updateFilter('tipo', e.target.value)}
            className="custom-select px-3 py-2 rounded-lg border border-border-subtle bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-body"
          >
            {TIPO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors font-body"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Limpar
            </button>
          )}
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted font-body">Período:</span>
          <input
            type="date"
            lang="pt-BR"
            value={filters.dateFrom}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border-subtle bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary-500 transition-colors font-body"
          />
          <span className="text-text-muted text-sm">até</span>
          <input
            type="date"
            lang="pt-BR"
            value={filters.dateTo}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border-subtle bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary-500 transition-colors font-body"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-hover">
                <th
                  className="text-left px-4 py-3 font-semibold text-text-secondary font-body cursor-pointer group"
                  onClick={() => handleSort('nomePaciente')}
                >
                  <div className="flex items-center gap-1">
                    Paciente <SortIcon field="nomePaciente" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-text-secondary font-body cursor-pointer group"
                  onClick={() => handleSort('dataAgendamento')}
                >
                  <div className="flex items-center gap-1">
                    Data / Hora <SortIcon field="dataAgendamento" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-text-secondary font-body cursor-pointer group"
                  onClick={() => handleSort('tipo')}
                >
                  <div className="flex items-center gap-1">
                    Tipo <SortIcon field="tipo" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-text-secondary font-body cursor-pointer group"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon field="status" />
                  </div>
                </th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary font-body">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: filters.limit }).map((_, i) => (
                  <tr key={i} className="border-b border-border-subtle last:border-0">
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-28 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-surface-hover rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-surface-hover rounded animate-pulse mx-auto" /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-text-muted mb-2 block">search_off</span>
                    <p className="text-text-muted font-body">Nenhum agendamento encontrado</p>
                  </td>
                </tr>
              ) : (
                data.map((a) => {
                  const st = statusConfig[a.status] ?? { label: a.status, bg: 'bg-[#eceef0]', text: 'text-[#40484f]' };
                  const tp = tipoConfig[a.tipo] ?? { icon: 'event' };
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-border-subtle last:border-0 hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${getAvatarColor(a.nomePaciente)}`}>
                            {getInitials(a.nomePaciente)}
                          </div>
                          <span className="font-medium text-text-primary font-body">{a.nomePaciente}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary font-body">
                        {formatDate(a.dataAgendamento)} &middot; {formatTime(a.dataAgendamento)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-text-secondary font-body">
                          <span className="material-symbols-outlined text-[16px]">{tp.icon}</span>
                          <span className="capitalize">{a.tipo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditing(a)}
                            className="p-1.5 rounded-lg hover:bg-primary-500/10 text-text-muted hover:text-primary-500 transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleting(a)}
                            className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                            title="Remover"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {meta.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border-subtle">
            <div className="flex items-center gap-2 text-sm text-text-muted font-body">
              <span>Exibindo</span>
              <select
                value={filters.limit}
                onChange={(e) => updateFilter('limit', Number(e.target.value))}
                className="custom-select px-2 py-1 rounded border border-border-subtle bg-bg-base text-text-primary text-sm font-body"
              >
                {LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>
                de {meta.total}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: 1 }))}
                disabled={meta.page <= 1}
                className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Primeira pagina"
              >
                <span className="material-symbols-outlined text-[20px]">first_page</span>
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                disabled={meta.page <= 1}
                className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Anterior"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <span className="px-3 py-1 text-sm font-medium font-body text-text-primary">
                {meta.page} / {meta.totalPages}
              </span>

              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                disabled={meta.page >= meta.totalPages}
                className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Proxima"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, page: meta.totalPages }))}
                disabled={meta.page >= meta.totalPages}
                className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Ultima pagina"
              >
                <span className="material-symbols-outlined text-[20px]">last_page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
