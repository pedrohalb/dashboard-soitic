import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  StatusAgendamento as PrismaStatus,
  TipoAgendamento as PrismaTipo,
} from '@prisma/client';
import { StatusAgendamento, TipoAgendamento } from './appointment.enums';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

const statusMap: Record<string, PrismaStatus> = {
  [StatusAgendamento.CONFIRMADO]: PrismaStatus.confirmado,
  [StatusAgendamento.PENDENTE]: PrismaStatus.pendente,
  [StatusAgendamento.CANCELADO]: PrismaStatus.cancelado,
  [StatusAgendamento.EM_ESPERA]: PrismaStatus.em_espera,
  [StatusAgendamento.A_CAMINHO]: PrismaStatus.a_caminho,
  [StatusAgendamento.ATRASADO]: PrismaStatus.atrasado,
};

const tipoMap: Record<string, PrismaTipo> = {
  [TipoAgendamento.PRIMEIRA_CONSULTA]: PrismaTipo.primeira_consulta,
  [TipoAgendamento.RETORNO]: PrismaTipo.retorno,
  [TipoAgendamento.EXAME]: PrismaTipo.exame,
  [TipoAgendamento.URGENCIA]: PrismaTipo.urgencia,
};

const reverseStatusMap: Record<string, string> = Object.fromEntries(
  Object.entries(statusMap).map(([app, prisma]) => [prisma, app]),
);

const reverseTipoMap: Record<string, string> = Object.fromEntries(
  Object.entries(tipoMap).map(([app, prisma]) => [prisma, app]),
);

function normalizeRecord<T extends { status: string; tipo: string }>(
  record: T,
): T {
  return {
    ...record,
    status: reverseStatusMap[record.status] ?? record.status,
    tipo: reverseTipoMap[record.tipo] ?? record.tipo,
  };
}

@Injectable()
export class AppointmentsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.agendamento.count();
    if (count === 0) {
      await this.seed();
    }
  }

  private async seed() {
    const seedData = [
      // === Semana atual (06/04 - 12/04) ===
      {
        nomePaciente: 'Ana Silva',
        dataAgendamento: new Date('2026-04-06T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Bruno Oliveira',
        dataAgendamento: new Date('2026-04-06T10:30:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Carla Santos',
        dataAgendamento: new Date('2026-04-06T14:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Daniel Costa',
        dataAgendamento: new Date('2026-04-07T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Eduarda Lima',
        dataAgendamento: new Date('2026-04-07T11:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Ricardo Albuquerque',
        dataAgendamento: new Date('2026-04-07T14:30:00'),
        status: PrismaStatus.em_espera,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Beatriz Mendonça',
        dataAgendamento: new Date('2026-04-07T15:15:00'),
        status: PrismaStatus.a_caminho,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Carlos Eduardo',
        dataAgendamento: new Date('2026-04-08T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Luciana Ferraz',
        dataAgendamento: new Date('2026-04-08T10:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.urgencia,
      },
      {
        nomePaciente: 'Fernando Rocha',
        dataAgendamento: new Date('2026-04-09T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Mariana Duarte',
        dataAgendamento: new Date('2026-04-09T11:00:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Gustavo Henrique',
        dataAgendamento: new Date('2026-04-09T14:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Patrícia Nunes',
        dataAgendamento: new Date('2026-04-10T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Rafael Mendes',
        dataAgendamento: new Date('2026-04-10T10:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Camila Borges',
        dataAgendamento: new Date('2026-04-10T14:30:00'),
        status: PrismaStatus.atrasado,
        tipo: PrismaTipo.urgencia,
      },
      {
        nomePaciente: 'Thiago Martins',
        dataAgendamento: new Date('2026-04-11T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Juliana Farias',
        dataAgendamento: new Date('2026-04-11T11:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      // === Semanas anteriores de abril ===
      {
        nomePaciente: 'André Lopes',
        dataAgendamento: new Date('2026-04-01T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Renata Dias',
        dataAgendamento: new Date('2026-04-01T10:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Vinícius Cardoso',
        dataAgendamento: new Date('2026-04-01T14:00:00'),
        status: PrismaStatus.cancelado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Isabela Ramos',
        dataAgendamento: new Date('2026-04-02T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Felipe Araújo',
        dataAgendamento: new Date('2026-04-02T11:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.urgencia,
      },
      {
        nomePaciente: 'Larissa Teixeira',
        dataAgendamento: new Date('2026-04-02T15:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Marcos Vieira',
        dataAgendamento: new Date('2026-04-03T09:00:00'),
        status: PrismaStatus.cancelado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Fernanda Gomes',
        dataAgendamento: new Date('2026-04-03T10:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Diego Nascimento',
        dataAgendamento: new Date('2026-04-03T14:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Amanda Pereira',
        dataAgendamento: new Date('2026-04-04T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Lucas Barbosa',
        dataAgendamento: new Date('2026-04-04T11:00:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Sofia Monteiro',
        dataAgendamento: new Date('2026-04-05T10:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      // === Restante do mês (09/04 - 30/04) ===
      {
        nomePaciente: 'Paulo Henrique',
        dataAgendamento: new Date('2026-04-12T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Aline Castro',
        dataAgendamento: new Date('2026-04-12T10:30:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Roberto Dias',
        dataAgendamento: new Date('2026-04-13T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Tatiane Souza',
        dataAgendamento: new Date('2026-04-13T11:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Leandro Alves',
        dataAgendamento: new Date('2026-04-14T09:00:00'),
        status: PrismaStatus.em_espera,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Vanessa Ribeiro',
        dataAgendamento: new Date('2026-04-14T14:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.urgencia,
      },
      {
        nomePaciente: 'João Pedro',
        dataAgendamento: new Date('2026-04-15T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Gabriela Freitas',
        dataAgendamento: new Date('2026-04-15T10:00:00'),
        status: PrismaStatus.cancelado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Eduardo Pires',
        dataAgendamento: new Date('2026-04-16T09:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Patrícia Alves',
        dataAgendamento: new Date('2026-04-16T14:00:00'),
        status: PrismaStatus.atrasado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Felipe Gomes',
        dataAgendamento: new Date('2026-04-17T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Julio Cesar',
        dataAgendamento: new Date('2026-04-17T11:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Renan Carvalho',
        dataAgendamento: new Date('2026-04-20T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Bruna Tavares',
        dataAgendamento: new Date('2026-04-20T10:00:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Claudio Mendes',
        dataAgendamento: new Date('2026-04-21T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Débora Martins',
        dataAgendamento: new Date('2026-04-21T14:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.urgencia,
      },
      {
        nomePaciente: 'Igor Rocha',
        dataAgendamento: new Date('2026-04-22T08:30:00'),
        status: PrismaStatus.a_caminho,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Camila Duarte',
        dataAgendamento: new Date('2026-04-22T11:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Rodrigo Nunes',
        dataAgendamento: new Date('2026-04-23T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Elaine Cardoso',
        dataAgendamento: new Date('2026-04-23T10:30:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Marcelo Pinto',
        dataAgendamento: new Date('2026-04-24T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Simone Freire',
        dataAgendamento: new Date('2026-04-24T14:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Otávio Ribeiro',
        dataAgendamento: new Date('2026-04-27T09:00:00'),
        status: PrismaStatus.cancelado,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Carolina Batista',
        dataAgendamento: new Date('2026-04-27T11:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Anderson Silva',
        dataAgendamento: new Date('2026-04-28T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Juliana Prado',
        dataAgendamento: new Date('2026-04-28T10:00:00'),
        status: PrismaStatus.em_espera,
        tipo: PrismaTipo.exame,
      },
      {
        nomePaciente: 'Ricardo Teixeira',
        dataAgendamento: new Date('2026-04-29T09:00:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.urgencia,
      },
      {
        nomePaciente: 'Fernanda Lopes',
        dataAgendamento: new Date('2026-04-29T14:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.retorno,
      },
      {
        nomePaciente: 'Lucas Freitas',
        dataAgendamento: new Date('2026-04-30T08:30:00'),
        status: PrismaStatus.confirmado,
        tipo: PrismaTipo.primeira_consulta,
      },
      {
        nomePaciente: 'Bianca Souza',
        dataAgendamento: new Date('2026-04-30T11:00:00'),
        status: PrismaStatus.pendente,
        tipo: PrismaTipo.exame,
      },
    ];

    await this.prisma.agendamento.createMany({ data: seedData });
    console.log('✅ Seed: ' + seedData.length + ' agendamentos inseridos.');
  }

  async findAll() {
    const data = await this.prisma.agendamento.findMany({
      orderBy: { dataAgendamento: 'asc' },
    });
    return data.map(normalizeRecord);
  }

  async findOne(id: number) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
    });
    if (!agendamento) {
      throw new NotFoundException(`Agendamento #${id} não encontrado`);
    }
    return normalizeRecord(agendamento);
  }

  async create(dto: CreateAppointmentDto) {
    const record = await this.prisma.agendamento.create({
      data: {
        nomePaciente: dto.nomePaciente,
        dataAgendamento: new Date(dto.dataAgendamento),
        status: statusMap[dto.status],
        tipo: tipoMap[dto.tipo],
      },
    });
    return normalizeRecord(record);
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    await this.findOne(id);
    const record = await this.prisma.agendamento.update({
      where: { id },
      data: {
        ...(dto.nomePaciente !== undefined && {
          nomePaciente: dto.nomePaciente,
        }),
        ...(dto.dataAgendamento !== undefined && {
          dataAgendamento: new Date(dto.dataAgendamento),
        }),
        ...(dto.status !== undefined && { status: statusMap[dto.status] }),
        ...(dto.tipo !== undefined && { tipo: tipoMap[dto.tipo] }),
      },
    });
    return normalizeRecord(record);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.agendamento.delete({ where: { id } });
  }

  async getStats() {
    const now = new Date();
    const brasiliaOffset = -3 * 60;
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasiliaTime = new Date(utcMs + brasiliaOffset * 60000);

    const startOfDay = new Date(
      Date.UTC(
        brasiliaTime.getFullYear(),
        brasiliaTime.getMonth(),
        brasiliaTime.getDate(),
        3,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        brasiliaTime.getFullYear(),
        brasiliaTime.getMonth(),
        brasiliaTime.getDate() + 1,
        2,
        59,
        59,
        999,
      ),
    );

    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + diffToMonday,
      0,
      0,
      0,
      0,
    );
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6,
      23,
      59,
      59,
      999,
    );

    const [
      todayAppointments,
      newPatients,
      pendingCount,
      cancelledCount,
      total,
    ] = await Promise.all([
      this.prisma.agendamento.count({
        where: {
          dataAgendamento: { gte: startOfDay, lte: endOfDay },
        },
      }),
      this.prisma.agendamento.count({
        where: {
          tipo: PrismaTipo.primeira_consulta,
          dataAgendamento: { gte: startOfWeek, lte: endOfWeek },
        },
      }),
      this.prisma.agendamento.count({
        where: { status: PrismaStatus.pendente },
      }),
      this.prisma.agendamento.count({
        where: { status: PrismaStatus.cancelado },
      }),
      this.prisma.agendamento.count(),
    ]);

    const attendanceRate =
      total > 0 ? Math.round(((total - cancelledCount) / total) * 100) : 0;

    return {
      todayAppointments,
      newPatients,
      pendingCount,
      cancelledCount,
      attendanceRate,
      total,
    };
  }

  async getWeeklyVolume() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + diffToMonday,
    );
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6,
      23,
      59,
      59,
      999,
    );

    const appointments = await this.prisma.agendamento.findMany({
      where: {
        dataAgendamento: { gte: startOfWeek, lte: endOfWeek },
      },
      select: { dataAgendamento: true },
    });

    const countsByDate = this.groupByDate(appointments);

    const weekDays: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = this.formatDate(d);
      weekDays.push({ date: dateStr, count: countsByDate[dateStr] ?? 0 });
    }
    return weekDays;
  }

  async getMonthlyVolume() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const appointments = await this.prisma.agendamento.findMany({
      where: {
        dataAgendamento: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { dataAgendamento: true },
    });

    const countsByDate = this.groupByDate(appointments);

    const totalDays = endOfMonth.getDate();
    const monthDays: { date: string; count: number }[] = [];
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), i);
      const dateStr = this.formatDate(d);
      monthDays.push({ date: dateStr, count: countsByDate[dateStr] ?? 0 });
    }
    return monthDays;
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private groupByDate(
    appointments: { dataAgendamento: Date }[],
  ): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const a of appointments) {
      const key = this.formatDate(a.dataAgendamento);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }

  async findPaginated(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    tipo?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;
    const sortBy = params.sortBy ?? 'dataAgendamento';
    const sortOrder = params.sortOrder ?? 'desc';

    const allowedSortFields = [
      'dataAgendamento',
      'nomePaciente',
      'status',
      'tipo',
    ];
    const orderField = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'dataAgendamento';

    const where: Record<string, unknown> = {};

    if (params.search) {
      where.nomePaciente = { contains: params.search, mode: 'insensitive' };
    }

    if (params.status) {
      const mapped = statusMap[params.status];
      if (mapped) where.status = mapped;
    }

    if (params.tipo) {
      const mapped = tipoMap[params.tipo];
      if (mapped) where.tipo = mapped;
    }

    if (params.dateFrom || params.dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (params.dateFrom) dateFilter.gte = new Date(params.dateFrom);
      if (params.dateTo) {
        const end = new Date(params.dateTo);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }
      where.dataAgendamento = dateFilter;
    }

    const [data, total] = await Promise.all([
      this.prisma.agendamento.findMany({
        where,
        orderBy: { [orderField]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.agendamento.count({ where }),
    ]);

    return {
      data: data.map(normalizeRecord),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUpcoming(limit = 100) {
    const data = await this.prisma.agendamento.findMany({
      where: { dataAgendamento: { gte: new Date() } },
      orderBy: { dataAgendamento: 'asc' },
      take: limit,
    });
    return data.map(normalizeRecord);
  }
}
