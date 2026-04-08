import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Get('weekly-volume')
  getWeeklyVolume() {
    return this.service.getWeeklyVolume();
  }

  @Get('monthly-volume')
  getMonthlyVolume() {
    return this.service.getMonthlyVolume();
  }

  @Get('upcoming')
  getUpcoming(@Query('limit') limit?: string) {
    return this.service.getUpcoming(limit ? Number(limit) : 4);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
