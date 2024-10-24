import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/utils/validator/unique.validator';

export class MessageDto {
  @IsInt()
  id: number;

  @IsObject()
  @IsOptional()
  sender: { id: number };

  @IsObject()
  @IsOptional()
  receiver: { id: number };

  @IsString()
  message: string;

  @IsString()
  file: string;

  @IsOptional()
  is_read: number;

  @IsString()
  room_receiver: string;

  @IsString()
  @IsOptional()
  room_sender: string;

  @IsObject()
  @IsOptional()
  conversation_id: { id: number };
}

export class SendMessageDto extends OmitType(MessageDto, ['id']) {}

export class ConversationDto {
  @IsInt()
  id: number;

  @IsObject()
  @IsOptional()
  user1: { id: number };

  @IsObject()
  @IsOptional()
  user2: { id: number };
}
