import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BookService {
  private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: 'html css',
      author: 'AriiqMaazin',
      year: 2023,
    },
  ];

  getAllBook(): {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] {
    return this.books;
  }

  createBook(
    title: string,
    author: string,
    year: number,
  ): {
    status: string;
    message: string;
  } {
    this.books.push({
      id: new Date().getTime(),
      title: title,
      author: author,
      year: year,
    });

    return {
      status: 'Success',
      message: 'Berhasil menambakan buku',
    };
  }

  getDetail(id: number): {
    id?: number;
    title: string;
    author: string;
    year: number;
  } {
    const bookIndex = this.findBookById(id);
    const book = this.books[bookIndex];

    return book;
  }

  updateBook(
    id: number,
    payload: any,
  ): {
    status: string;
    message: string;
  } {
    const { title, author, year } = payload;
    const bookIndex = this.findBookById(id);
    this.books[bookIndex].title = title;
    this.books[bookIndex].author = author;
    this.books[bookIndex].year = year;

    return {
      status: 'ok',
      message: 'Berhasil memperbaharui buku',
    };
  }

  deleteBook(
    id: number,
  ): {
    status: string;
    message: string;
  } {
    const bookIndex = this.findBookById(id);
    this.books.splice(bookIndex, 1);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus buku',
    };
  }

  private findBookById(id: number) {
    // mencari index book bedasarkan id
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === 1) {
      throw new NotFoundException(`buku dengan ${id} tidak di temukan`);
    }

    return bookIndex;
  }
}
