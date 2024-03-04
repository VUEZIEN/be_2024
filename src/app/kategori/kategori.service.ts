import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Like, Repository } from 'typeorm';
import { Kategori } from './kategori.entity';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  createKategoriArrayDto,
  findAllKategori,
} from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { User } from '../auth/auth.entity';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any,
    @InjectRepository(Kategori)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save(payload);

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async update(
    id: number,
    payload: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const kat = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
    });

    if (kat === null) {
      throw new NotFoundException(`kategori dengan id ${id} tidak di temukan`);
    }

    try {
      await this.kategoriRepository.save({ ...payload, id: id });
      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const kat = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
    });

    if (kat === null) {
      throw new NotFoundException(`kategori dengan id ${id} tidak di temukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil',
      data: kat,
    };
  }

  async delete(id: number): Promise<ResponseSuccess> {
    const delet = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
    });

    if (delet === null) {
      throw new NotFoundException(`pembelian dengan id ${id} tidak di temukan`);
    }
    const hapus = await this.kategoriRepository.delete(id);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus kategori',
      data: hapus,
    };
  }

  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori, nama_user } = query;

    console.log('query', query);

    const filterQuery: any = {};
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }

    if (nama_user) {
      filterQuery.created_by = {
        nama: Like(`%${nama_user}%`),
      };
    }

    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });

    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_kategori: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('oke', result, total, page, pageSize);
  }

  async getUserCategory(): Promise<ResponseSuccess> {
    const user = await this.userRepository.findOne({
      where: {
        id: this.req.user.id,
      },
      relations: ['kategori_create_by', 'kategori_updated_by'],
      select: {
        id: true,
        nama: true,
        kategori_create_by: {
          id: true,
          nama_kategori: true,
        },
      },
    });

    return this._success('ok', user);
  }

  async bulkCreate(payload: createKategoriArrayDto): Promise<ResponseSuccess> {
    try {
      await Promise.all(
        payload.data.map(async (item) => {
          await this.kategoriRepository.save(item);
        }),
      );

      return this._success('oke');
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
