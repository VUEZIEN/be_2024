import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './chat.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}
  @Post('/generate-conversation-id')
  async generate(@Body('user2') user2: number) {
    return this.chat.generateConversationId(user2);
  }

  @Post('send_message')
  async send_message(@Body() payload: SendMessageDto) {
    return this.chat.create(payload);
  }

  @Get('list')
  async list() {
    return this.chat.list();
  }
}
