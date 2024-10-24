import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation]), WebsocketModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
