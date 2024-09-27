import { Controller, Get } from '@nestjs/common';

@Controller()
export class V1Controller {
  @Get()
  GetHome() {
    return 'Welcome to the V1 API';
  }

  @Get('/health')
  GetHealth() {
    return 'Health check successful';
  }
}
