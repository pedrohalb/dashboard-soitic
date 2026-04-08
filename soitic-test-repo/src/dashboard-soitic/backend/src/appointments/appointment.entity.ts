import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AppointmentStatus {
  CONFIRMADO = 'confirmado',
  PENDENTE = 'pendente',
  CANCELADO = 'cancelado',
  EM_ESPERA = 'em espera',
  A_CAMINHO = 'a caminho',
  ATRASADO = 'atrasado',
}

export enum AppointmentType {
  PRIMEIRA_CONSULTA = 'primeira consulta',
  RETORNO = 'retorno',
  EXAME = 'exame',
  URGENCIA = 'urgência',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'appointment_date', type: 'timestamptz' })
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDENTE,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.PRIMEIRA_CONSULTA,
  })
  type: AppointmentType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
