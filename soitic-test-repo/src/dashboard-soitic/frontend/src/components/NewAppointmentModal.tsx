import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CriarAgendamentoDto, StatusAgendamento, TipoAgendamento } from '../types';
import { appointmentsApi } from '../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const statusOptions: { value: StatusAgendamento; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em espera', label: 'Em Espera' },
  { value: 'a caminho', label: 'A Caminho' },
];

const tipoOptions: { value: TipoAgendamento; label: string }[] = [
  { value: 'primeira consulta', label: 'Primeira Consulta' },
  { value: 'retorno', label: 'Retorno' },
  { value: 'exame', label: 'Exame' },
  { value: 'urgência', label: 'Urgência' },
];

export function NewAppointmentModal({ open, onClose, onCreated }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState<CriarAgendamentoDto>({
    nomePaciente: '',
    dataAgendamento: '',
    status: 'pendente',
    tipo: 'primeira consulta',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.nomePaciente.trim() || !form.dataAgendamento) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentsApi.create({
        ...form,
        dataAgendamento: new Date(form.dataAgendamento).toISOString(),
      });
      onCreated?.();
      onClose();
      setForm({ nomePaciente: '', dataAgendamento: '', status: 'pendente', tipo: 'primeira consulta' });
      navigate('/appointments');
    } catch {
      setError('Erro ao criar agendamento. Verifique se o backend está disponível.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
          <h2 className="text-xl font-extrabold font-headline text-text-primary">
            Novo Agendamento
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-hover transition-colors text-text-muted"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-error/10 text-error border border-error/20 text-sm font-medium font-body">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Nome do Paciente */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold font-body text-text-secondary">
              Nome do Paciente <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="nomePaciente"
              value={form.nomePaciente}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-surface text-text-primary text-sm font-body placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Data e Hora */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold font-body text-text-secondary">
              Data e Hora <span className="text-error">*</span>
            </label>
            <input
              type="datetime-local"
              name="dataAgendamento"
              value={form.dataAgendamento}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-surface text-text-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Tipo + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold font-body text-text-secondary">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="custom-select w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-surface text-text-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors"
              >
                {tipoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold font-body text-text-secondary">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="custom-select w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-surface text-text-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold font-body text-text-secondary hover:bg-surface-hover transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold font-body text-white bg-gradient-to-r from-secondary-500 to-primary-500 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              )}
              Criar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
