import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { V1Controller } from './v1.controller';

import cookieParser from 'cookie-parser';
import Authenticate from './auth/authenticate.middleware';

@Module({
  controllers: [AuthController, UserController, V1Controller],
  providers: [AuthService, UserService],
})
export class V1Module implements NestModule {
  configure(consumer) {
    // consumer
    //   .apply()
    //   .forRoutes(
    //     { path: 'api/v1/auth', method: RequestMethod.ALL },
    //     { path: 'api/v1/user', method: RequestMethod.ALL },
    //   );
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(Authenticate).forRoutes(UserController);
  }
}
