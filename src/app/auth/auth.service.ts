import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User } from './auth.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import { compare, hash } from 'bcrypt';
import { ResponseSuccess } from 'src/interface';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ResetPassword } from '../mail/reset_password.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
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
    const reg = await this.authRepository.save(payload);

    return this._success('Register Berhasil', reg);
  }

  private generateJWT(
    payload: jwtPayload,
    expiresIn: string | number,
    secret_key: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: secret_key,
      expiresIn: expiresIn,
    });
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
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '1m',
        jwt_config.access_token_secret,
      );
      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );
      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      });
      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', user);
  }
  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex'); // membuat token
    const link = `http://localhost:3200/auth/reset-password/${user.id}/${token}`;
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };
    await this.resetPasswordRepository.save(payload);

    return this._success('Silahkan Cek Email');
  }
}
