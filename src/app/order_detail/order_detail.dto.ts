/* eslint-disable @typescript-eslint/no-unused-vars */
import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsNumber } from 'class-validator';

export class OrderDetailDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsNumber()
  jumlah: number;

  @IsNumber()
  jumlah_harga: number;

  @IsObject()
  produk: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
  @IsObject()
  @IsOptional()
  created_by: { id: number };
}
