import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface/response.interface';
import { LoginDto, RegisterDto } from './auth.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
  ) {
    super();
  }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12);
    await this.authRepository.save(payload);

    return this._success('Register Berhasil');
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );
    if (checkPassword) {
      return this._success('Login Success', checkUserExists);
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
