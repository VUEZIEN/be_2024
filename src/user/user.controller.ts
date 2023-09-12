import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Post('create')
  createUser(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @Put('update/:id')
  findOneUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.updateUser(Number(id), payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.userService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
