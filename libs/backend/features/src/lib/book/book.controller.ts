import {
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    Logger,
    Put,
    Request
} from '@nestjs/common';
import { BookService } from './book.service';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { IBook } from '@avans-nx-workshop/shared/api';
import { CreateBookDto, UpdateBookDto } from '@avans-nx-workshop/backend/dto';
import { AuthGuard } from '@avans-nx-workshop/backend/auth';

@Controller('book')
export class BookController {
    private readonly logger = new Logger(BookController.name);

    constructor(private bookService: BookService) {}

    @Get('')
    getAll(): Promise<IBook[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IBook | null> {
        return this.bookService.findOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    create(@Request() req: any): Promise<IBook | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.bookService.create(req);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
        this.logger.log(
            `User ${req.user?.user_id} attempting to delete book with id ${id}`
        );
        const success = await this.bookService.deleteBookById(id);
        if (!success) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id')
    async updateBook(
        @Param('id') id: string,
        @Body() updateBookDto: UpdateBookDto
    ): Promise<IBook | null> {
        console.log('Received UpdateBookDto:', updateBookDto); // Log de data
        const updatedBook = await this.bookService.updateBook(
            id,
            updateBookDto
        );
        if (!updatedBook) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
        return updatedBook;
    }
}
