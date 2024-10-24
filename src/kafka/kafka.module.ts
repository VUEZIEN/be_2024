import { Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from 'src/config/kafka.config';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LATIHAN_KAFKA',
        ...kafkaConfig,
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
