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
import { Review } from './book.schema';

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
        this.logger.log('req.user = ', req.user); // Log de volledige inhoud van req.user
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
    @UseGuards(AuthGuard)
    async updateBook(
        @Param('id') id: string,
        @Body() updateBookDto: UpdateBookDto,
        @Request() req: any
    ): Promise<IBook | null> {
        this.logger.log(
            `User ${req.user.user_id} attempting to update book with ID ${id}`
        );
        return this.bookService.updateBook(id, updateBookDto, req.user.user_id);
    }

    @Post(':id/reviews')
    @UseGuards(AuthGuard)
    async addReview(
        @Param('id') bookId: string,
        @Body() body: { comment: string; rating: number },
        @Request() req: any
    ): Promise<IBook> {
        const userId = req.user.user_id;
        return this.bookService.addReview(
            bookId,
            userId,
            body.comment,
            body.rating
        );
    }

    @Get(':id/reviews')
    async getReviews(@Param('id') bookId: string): Promise<Review[]> {
        return this.bookService.getReviews(bookId);
    }
}
