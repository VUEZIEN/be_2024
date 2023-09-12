import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('list')
  getAllBook() {
    return this.bookService.getAllBook();
  }

  @Post('create')
  createBook(
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('year') year: number,
  ) {
    return this.bookService.createBook(title, author, year);
  }

  // @Post('create')
  // createBook(@Body() payload: any) {
  //   return this.bookService.createBook;
  // }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Put('update/:id')
  findOneBook(@Param('id') id: string, @Body() payload: any) {
    return this.bookService.updateBook(Number(id), payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}

const array = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
];

array[2];
