/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/auth/auth.entity';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { latihanQueryBuilderDto } from './query-builder.dto';

@Injectable()
export class QueryBuilderService extends BaseResponse {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async latihan() {
    const querybuilder = await this.userRepository.createQueryBuilder('user');
    querybuilder.select(['user.id', 'user.nama']);
    const result = await querybuilder.getQuery();

    return this._success('ok', result);
  }
}
