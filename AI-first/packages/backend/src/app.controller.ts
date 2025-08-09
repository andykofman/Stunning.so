import { Controller, Get } from '@nestjs/common';
import { sharedExample } from '@shared/index';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `${this.appService.getHello()} - ${sharedExample()}`;
  }
}
