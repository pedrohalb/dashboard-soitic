import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus, AppointmentType } from '../appointment.entity';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  patientName?: string;

  @IsDateString()
  @IsOptional()
  appointmentDate?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsEnum(AppointmentType)
  @IsOptional()
  type?: AppointmentType;
}
