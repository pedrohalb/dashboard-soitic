import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus, AppointmentType } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService implements OnModuleInit {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) { }

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.seed();
    }
  }

  private async seed() {
    const seedData = [
      // === Semana atual (06/04 - 12/04) ===
      { patientName: 'Ana Silva', appointmentDate: new Date('2026-04-06T09:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Bruno Oliveira', appointmentDate: new Date('2026-04-06T10:30:00'), status: AppointmentStatus.PENDENTE, type: AppointmentType.RETORNO },
      { patientName: 'Carla Santos', appointmentDate: new Date('2026-04-06T14:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.EXAME },
      { patientName: 'Daniel Costa', appointmentDate: new Date('2026-04-07T08:30:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Eduarda Lima', appointmentDate: new Date('2026-04-07T11:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Ricardo Albuquerque', appointmentDate: new Date('2026-04-07T14:30:00'), status: AppointmentStatus.EM_ESPERA, type: AppointmentType.RETORNO },
      { patientName: 'Beatriz Mendonça', appointmentDate: new Date('2026-04-07T15:15:00'), status: AppointmentStatus.A_CAMINHO, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Carlos Eduardo', appointmentDate: new Date('2026-04-08T09:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.EXAME },
      { patientName: 'Luciana Ferraz', appointmentDate: new Date('2026-04-08T10:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.URGENCIA },
      { patientName: 'Fernando Rocha', appointmentDate: new Date('2026-04-09T09:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Mariana Duarte', appointmentDate: new Date('2026-04-09T11:00:00'), status: AppointmentStatus.PENDENTE, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Gustavo Henrique', appointmentDate: new Date('2026-04-09T14:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Patrícia Nunes', appointmentDate: new Date('2026-04-10T08:30:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.EXAME },
      { patientName: 'Rafael Mendes', appointmentDate: new Date('2026-04-10T10:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Camila Borges', appointmentDate: new Date('2026-04-10T14:30:00'), status: AppointmentStatus.ATRASADO, type: AppointmentType.URGENCIA },
      { patientName: 'Thiago Martins', appointmentDate: new Date('2026-04-11T09:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Juliana Farias', appointmentDate: new Date('2026-04-11T11:30:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },

      // === Semanas anteriores de abril ===
      { patientName: 'André Lopes', appointmentDate: new Date('2026-04-01T09:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Renata Dias', appointmentDate: new Date('2026-04-01T10:30:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.EXAME },
      { patientName: 'Vinícius Cardoso', appointmentDate: new Date('2026-04-01T14:00:00'), status: AppointmentStatus.CANCELADO, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Isabela Ramos', appointmentDate: new Date('2026-04-02T08:30:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Felipe Araújo', appointmentDate: new Date('2026-04-02T11:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.URGENCIA },
      { patientName: 'Larissa Teixeira', appointmentDate: new Date('2026-04-02T15:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.EXAME },
      { patientName: 'Marcos Vieira', appointmentDate: new Date('2026-04-03T09:00:00'), status: AppointmentStatus.CANCELADO, type: AppointmentType.RETORNO },
      { patientName: 'Fernanda Gomes', appointmentDate: new Date('2026-04-03T10:30:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.PRIMEIRA_CONSULTA },
      { patientName: 'Diego Nascimento', appointmentDate: new Date('2026-04-03T14:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.RETORNO },
      { patientName: 'Amanda Pereira', appointmentDate: new Date('2026-04-04T09:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.EXAME },
      { patientName: 'Lucas Barbosa', appointmentDate: new Date('2026-04-04T11:00:00'), status: AppointmentStatus.PENDENTE, type: AppointmentType.RETORNO },
      { patientName: 'Sofia Monteiro', appointmentDate: new Date('2026-04-05T10:00:00'), status: AppointmentStatus.CONFIRMADO, type: AppointmentType.PRIMEIRA_CONSULTA },
    ];

    await this.repo.save(seedData);
    console.log('✅ Seed: ' + seedData.length + ' agendamentos inseridos.');
  }

  findAll(): Promise<Appointment[]> {
    return this.repo.find({ order: { appointmentDate: 'ASC' } });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.repo.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException(`Agendamento #${id} não encontrado`);
    }
    return appointment;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.repo.create({
      ...dto,
      appointmentDate: new Date(dto.appointmentDate),
    });
    return this.repo.save(appointment);
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    const updated = Object.assign(appointment, {
      ...dto,
      ...(dto.appointmentDate && { appointmentDate: new Date(dto.appointmentDate) }),
    });
    return this.repo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.repo.remove(appointment);
  }

  async getStats() {
    // Calcula "agora" no fuso de Brasília
    const now = new Date();
    const brasiliaOffset = -3 * 60; // UTC-3 em minutos
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasiliaTime = new Date(utcMs + brasiliaOffset * 60000);

    const startOfDay = new Date(Date.UTC(
      brasiliaTime.getFullYear(), brasiliaTime.getMonth(), brasiliaTime.getDate(), 3, 0, 0 // 00:00 BRT = 03:00 UTC
    ));
    const endOfDay = new Date(Date.UTC(
      brasiliaTime.getFullYear(), brasiliaTime.getMonth(), brasiliaTime.getDate() + 1, 2, 59, 59, 999 // 23:59 BRT = 02:59+1 UTC
    ));

    // Semana: segunda a domingo
    const dayOfWeek = now.getDay(); // 0 = domingo
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6, 23, 59, 59, 999);

    const [todayAppointments, newPatients, pendingCount, cancelledCount, total] =
      await Promise.all([
        this.repo.count({
          where: { appointmentDate: Between(startOfDay, endOfDay) },
        }),
        this.repo.count({
          where: {
            type: AppointmentType.PRIMEIRA_CONSULTA,
            appointmentDate: Between(startOfWeek, endOfWeek),
          },
        }),
        this.repo.count({ where: { status: AppointmentStatus.PENDENTE } }),
        this.repo.count({ where: { status: AppointmentStatus.CANCELADO } }),
        this.repo.count(),
      ]);

    const attendanceRate = total > 0
      ? Math.round(((total - cancelledCount) / total) * 100)
      : 0;

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

    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toISOString().split('T')[0]; // "2026-04-06"
    const endStr = endOfWeek.toISOString().split('T')[0];       // "2026-04-12"

    const result = await this.repo
      .createQueryBuilder('a')
      .select("TO_CHAR(a.appointment_date, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .where("a.appointment_date >= :start AND a.appointment_date <= :end", {
        start: `${startStr}T00:00:00`,
        end: `${endStr}T23:59:59.999`,
      })
      .groupBy("TO_CHAR(a.appointment_date, 'YYYY-MM-DD')")
      .orderBy("TO_CHAR(a.appointment_date, 'YYYY-MM-DD')", 'ASC')
      .getRawMany();

    // Preenche todos os 7 dias da semana, mesmo sem agendamentos
    const weekDays: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const found = result.find((r: any) => r.date === dateStr);
      weekDays.push({ date: dateStr, count: found ? Number(found.count) : 0 });
    }
    return weekDays;
  }

  async getMonthlyVolume() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // último dia do mês

    const startStr = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-01`;
    const endStr = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;

    const result = await this.repo
      .createQueryBuilder('a')
      .select("TO_CHAR(a.appointment_date, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('a.appointment_date >= :start AND a.appointment_date <= :end', {
        start: `${startStr}T00:00:00`,
        end: `${endStr}T23:59:59`,
      })
      .groupBy("TO_CHAR(a.appointment_date, 'YYYY-MM-DD')")
      .orderBy("TO_CHAR(a.appointment_date, 'YYYY-MM-DD')", 'ASC')
      .getRawMany();

    const totalDays = endOfMonth.getDate();
    const monthDays: { date: string; count: number }[] = [];
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const found = result.find((r: any) => r.date === dateStr);
      monthDays.push({ date: dateStr, count: found ? Number(found.count) : 0 });
    }

    return monthDays;
  }

  async getUpcoming(limit = 100): Promise<Appointment[]> {
    return this.repo
      .createQueryBuilder('a')
      .where('a.appointment_date >= NOW()')
      .orderBy('a.appointment_date', 'ASC')
      .take(limit)
      .getMany();
  }
}