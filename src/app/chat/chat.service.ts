import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface';
import { Message } from './message.entity';
import { MessageGateway } from '../websocket/websocket.gateway';
import { SendMessageDto } from './chat.dto';

@Injectable()
export class ChatService extends BaseResponse {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly webService: MessageGateway,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async generateConversationId(user2: number): Promise<ResponseSuccess> {
    const user1 = this.req.user.id;

    const code = await this.conversationRepository.findOne({
      where: [
        {
          user1: {
            id: user1,
          },
          user2: {
            id: user2,
          },
        },
        {
          user1: {
            id: user2,
          },
          user2: {
            id: user1,
          },
        },
      ],
    });

    if (code === null) {
      const result = await this.conversationRepository.save({
        user1: {
          id: user1,
        },
        user2: {
          id: user2,
        },
      });

      return this._success('OK', {
        conversation_id: result.id,
        user1,
        user2,
      });
    }

    return this._success('OK', {
      conversation_id: code.id,
      user1,
      user2,
    });
  }

  async create(payload: SendMessageDto) {
    const result = await this.messageRepository.save({
      ...payload,
      sender: this.req.user.id,
      is_read: 0,
    });
    this.webService.create({
      ...result,
      room_receiver: payload.room_receiver,
      room_sender: this.req.user.email,
    });

    return this._success('OK');
  }

  async list(): Promise<ResponseSuccess> {
    const conversations = await this.conversationRepository.find({
      where: [
        { user1: { id: this.req.user.id } },
        { user2: { id: this.req.user.id } },
      ],
      relations: ['user1', 'user2'],
      select: {
        user1: { id: true, nama: true, email: true },
        user2: { id: true, nama: true, email: true },
      },
    });

    const conversationsWithLatestMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const messages = await this.messageRepository
          .createQueryBuilder('message')
          .leftJoin('message.sender', 'sender') // Gabungkan data sender
          .leftJoin('message.receiver', 'receiver') // Gabungkan data receiver
          .addSelect(['sender.id', 'receiver.id']) // Pilih hanya id sender dan receiver
          .where('message.conversation_id = :conversationId', {
            conversationId: conversation.id,
          })
          .orderBy('message.created_at', 'DESC')
          .limit(20)
          .getMany();

        const latestMessage = messages[0] || null;
        const totalMessages = await this.messageRepository
          .createQueryBuilder('message')
          .where('message.conversation_id = :conversationId', {
            conversationId: conversation.id,
          })
          .getCount();

        return {
          ...conversation,
          messages,
          conversation_id: conversation.id,
          latestMessage,
          totalMessages,
          limit: 0,
          pageSize: 10,
        };
      }),
    );

    const sortedConversations = conversationsWithLatestMessage.sort((a, b) => {
      const latestMessageA = a.latestMessage?.created_at || new Date(0);
      const latestMessageB = b.latestMessage?.created_at || new Date(0);
      return latestMessageB.getTime() - latestMessageA.getTime();
    });

    return this._success('OK', sortedConversations);
  }
}
