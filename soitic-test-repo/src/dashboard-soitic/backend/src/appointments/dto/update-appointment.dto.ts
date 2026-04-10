import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatusAgendamento, TipoAgendamento } from '../appointment.enums';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  nomePaciente?: string;

  @IsDateString()
  @IsOptional()
  dataAgendamento?: string;

  @IsEnum(StatusAgendamento)
  @IsOptional()
  status?: StatusAgendamento;

  @IsEnum(TipoAgendamento)
  @IsOptional()
  tipo?: TipoAgendamento;
}
