import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KafkaService } from './kafka.service';


@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

}
