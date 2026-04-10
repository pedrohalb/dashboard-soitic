import type { StatusAgendamento, TipoAgendamento } from "../types";

export const statusConfig: Record<
  StatusAgendamento,
  { label: string; bg: string; text: string }
> = {
  confirmado: {
    label: "Confirmado",
    bg: "bg-[#cde5ff]",
    text: "text-[#004b74]",
  },
  pendente: {
    label: "Pendente",
    bg: "bg-[#d6e4f5]",
    text: "text-[#53606e]",
  },
  cancelado: {
    label: "Cancelado",
    bg: "bg-[#ffdad6]",
    text: "text-[#93000a]",
  },
  "em espera": {
    label: "Em Espera",
    bg: "bg-[#d6e4f5]",
    text: "text-[#53606e]",
  },
  "a caminho": {
    label: "A caminho",
    bg: "bg-[#d6e3ff]",
    text: "text-[#00468d]",
  },
  atrasado: {
    label: "Atrasado",
    bg: "bg-[#ffdad6]",
    text: "text-[#ba1a1a]",
  },
};

export const tipoConfig: Record<TipoAgendamento, { icon: string }> = {
  "primeira consulta": { icon: "new_label" },
  retorno: { icon: "history" },
  exame: { icon: "biotech" },
  urgência: { icon: "emergency" },
};

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const label = date.toLocaleDateString("pt-BR", { weekday: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1).replace(".", "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-[#cde5ff] text-[#004b74]",
  "bg-[#d6e3ff] text-[#00468d]",
  "bg-[#d6e4f5] text-[#3b4855]",
  "bg-[#94ccff] text-[#001d32]",
  "bg-[#a9c7ff] text-[#001b3e]",
];

export function getAvatarColor(name: string): string {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[index];
}
