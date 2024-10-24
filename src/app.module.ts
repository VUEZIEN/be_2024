import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MailModule } from './app/mail/mail.module';
import { KategoriModule } from './app/kategori/kategori.module';
import { ProdukModule } from './app/produk/produk.module';
import { UploadController } from './app/upload/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { KonsumenModule } from './app/konsumen/konsumen.module';
import { ProfileModule } from './app/profile/profile.module';
import { OrderModule } from './app/order/order.module';
import { OrderDetailModule } from './app/order_detail/order_detail.module';
import { UniqueValidator } from './utils/validator/unique.validator';
import { QueryBuilderModule } from './query-builder/query-builder.module';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from './redis/redis.module';
import { WebsocketModule } from './app/websocket/websocket.module';
import { ChatModule } from './app/chat/chat.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    KategoriModule,
    ProdukModule,
    KonsumenModule,
    ProfileModule,
    OrderModule,
    OrderDetailModule,
    QueryBuilderModule,
    KafkaModule,
    RedisModule,
    WebsocketModule,
    ChatModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, UniqueValidator],
  exports: [],
})
export class AppModule {}
