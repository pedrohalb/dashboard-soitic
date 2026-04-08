import { IsString, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus, AppointmentType } from '../appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsDateString()
  appointmentDate: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsEnum(AppointmentType)
  type: AppointmentType;
}
