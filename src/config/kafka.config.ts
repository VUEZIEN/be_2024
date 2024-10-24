import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,

  options: {
    client: {
      clientId: `backend-smkmq`,
      brokers: [`localhost:9092`],
    },
    consumer: {
      groupId: `smkmq-group-1`,
    },
  },
};
