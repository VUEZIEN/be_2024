import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UserDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Length(3, 10)
  nama: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(15)
  @Max(20)
  umur: number;

  @IsNotEmpty()
  tanggal_lahir: string;

  @IsNotEmpty()
  status: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
export class UpdateUserDto extends PickType(UserDto, [
  'nama',
  'email',
  'umur',
  'tanggal_lahir',
  'status',
]) {}
