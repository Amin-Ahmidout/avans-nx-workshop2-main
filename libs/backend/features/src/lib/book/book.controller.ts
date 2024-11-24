import { Controller, Logger, Request } from '@nestjs/common';
import { BookService } from './book.service';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { IBook } from '@avans-nx-workshop/shared/api';
import { CreateBookDto } from '@avans-nx-workshop/backend/dto';
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
}
