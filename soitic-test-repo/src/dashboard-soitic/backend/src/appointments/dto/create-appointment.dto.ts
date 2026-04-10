import { IsString, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { StatusAgendamento, TipoAgendamento } from '../appointment.enums';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  nomePaciente!: string;

  @IsDateString()
  dataAgendamento!: string;

  @IsEnum(StatusAgendamento)
  status!: StatusAgendamento;

  @IsEnum(TipoAgendamento)
  tipo!: TipoAgendamento;
}
