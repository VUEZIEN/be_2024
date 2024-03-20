import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User, UserGoogle } from './auth.entity';
import {
  LoginDto,
  LoginGoogleDto,
  LoginWIthGoogleDTO,
  RegisterDto,
  ResetPasswordDto,
} from './auth.dto';
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
    @InjectRepository(UserGoogle)
    private readonly userGoogleRepo: Repository<UserGoogle>,
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

  async loginWithGoogle(payload: LoginWIthGoogleDTO) {
    console.log(payload);

    try {
      const resDecode: any = this.jwtService.decode(payload.id_token);

      if (resDecode.email == payload.email) {
        const checkUserExists = await this.userGoogleRepo.findOne({
          where: {
            email: payload.email,
          },
          select: {
            id: true,
            nama: true,
            email: true,
            refresh_token: true,
          },
        });

        if (checkUserExists == null) {
          const jwtPayload: jwtPayload = {
            id: payload.id,
            nama: payload.nama,
            email: payload.email,
          };

          const refresh_token = await this.generateJWT(
            jwtPayload,
            '7d',
            jwt_config.refresh_token_secret,
          );

          await this.userGoogleRepo.save({
            ...payload,
            refresh_token,
            id: payload.id,
          });
        }
      }
    } catch (error) {
      console.log('err', error);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDataloginGoogle(id: string) {
    const checkUserExists = await this.userGoogleRepo.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        refresh_token: true,
      },
    });

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

    return this._success('Login Success', {
      ...checkUserExists,
      access_token: access_token,
      role: 'siswa',
    });
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
      '10d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '1d',
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
    const token = randomBytes(32).toString('hex');
    const link = `http://localhost:4010/auth/reset-password/${user.id}/${token}`;
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

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    payload.new_password = await hash(payload.new_password, 12);
    await this.authRepository.save({
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }

  async loginGoogle(payload: LoginGoogleDto): Promise<ResponseSuccess> {
    console.log(payload);
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

    if (checkUserExists === null) {
      //register
      const newUser = await this.authRepository.save(payload);
      const jwtPayload: jwtPayload = {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
      };
      const access_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.access_token_secret,
      );
      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );

      await this.authRepository.update(newUser.id, {
        refresh_token: refresh_token,
      });
      return this._success('Registration Success', {
        ...newUser,
        access_token: access_token,
        refresh_token: refresh_token,
        role: 'Siswa',
      });
    } else {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '7d',
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
        role: 'Siswa',
      });
    }
  }
}
