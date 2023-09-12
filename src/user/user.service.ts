import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseSuccess } from 'src/interface/response.interface';
import { CreateUserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private users: {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  }[] = [
    {
      id: 1,
      nama: 'ariiq',
      email: 'ariiqmaazin@gmail.com',
      umur: 16,
      tanggal_lahir: '26-07-2007',
      status: 'pelajar',
    },
  ];

  getDetail(id: number): {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  } {
    const userIndex = this.findUserById(id);
    const user = this.users[userIndex];

    return user;
  }

  async getAllUser(): Promise<ResponseSuccess> {
    const user = await this.userRepository.find();
    return {
      status: 'ok',
      message: 'berhasil',
      data: user,
    };
  }

  async createUser(payload: CreateUserDto): Promise<ResponseSuccess> {
    try {
      const { nama, email, umur, tanggal_lahir, status } = payload;
      const userSave = await this.userRepository.save({
        nama: nama,
        email: email,
        umur: umur,
        tanggal_lahir: tanggal_lahir,
        status: status,
      });

      return {
        status: 'Success',
        message: 'Berhasil menambakan user',
        data: userSave,
      };
    } catch {
      throw new HttpException('Wrong Error', HttpStatus.BAD_REQUEST);
    }
  }

  updateUser(id: number, payload: any): ResponseSuccess {
    const { nama, email, umur, tanggal_lahir, status } = payload;
    const userIndex = this.findUserById(id);
    this.users[userIndex].nama = nama;
    this.users[userIndex].email = email;
    this.users[userIndex].umur = umur;
    this.users[userIndex].tanggal_lahir = tanggal_lahir;
    this.users[userIndex].status = status;

    return {
      status: 'ok',
      message: 'Berhasil memperbaharui user',
    };
  }

  deleteUser(id: number): ResponseSuccess {
    const userIndex = this.findUserById(id);
    this.users.splice(userIndex, 1);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus user',
    };
  }

  private findUserById(id: number) {
    // mencari index book bedasarkan id
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`usr dengan ${id} tidak di temukan`);
    }

    return userIndex;
  }
}
