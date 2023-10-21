import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import BaseResponse from "src/utils/response/base.response";
import { User } from "./auth.entity";
import { Repository } from "typeorm";
import { ResponseSuccess } from "src/interface/response";
import { RegisterDto } from "./auth.dto";
import { hash } from "bcrypt"; //import hash

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>
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
      throw new HttpException("User already registered", HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.authRepository.save(payload);

    return this._Sucsess("Register Berhasil");
  }
}
