import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthController } from './app/auth/auth.controller';
import { AuthService } from './app/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LatihanModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
  exports: [],
})
export class AppModule {}
