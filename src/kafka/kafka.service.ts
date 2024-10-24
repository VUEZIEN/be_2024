import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('LATIHAN_KAFKA') private kafkaClient: ClientKafka) {}
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('order');
    await this.kafkaClient.connect();
  }

  async sendMessagewithEmit(topic: string, key: string, payload: any) {
    return this.kafkaClient.emit(topic, {
      key: key,
      value: payload,
    });
  }

  async sendMessagewithSend(topic: string, key: string, payload: any) {
    try {
      const result = await firstValueFrom(
        this.kafkaClient.send(topic, {
          key: key,
          value: payload,
        }),
      );

      console.log('response kafka', result);
      return result;
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error;
    }
  }
}
