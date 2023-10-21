import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
// import { BookModule } from './book/book.module';
// import { UserModule } from './user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LatihanModule,
    // UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
