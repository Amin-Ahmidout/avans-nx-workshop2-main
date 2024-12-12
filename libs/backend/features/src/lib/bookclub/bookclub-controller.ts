import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Param,
    Body,
    Request,
    UseGuards,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { BookClubService } from '../bookclub/bookclub-service';
import { AuthGuard } from '@avans-nx-workshop/backend/auth';
import { BookClub } from '../bookclub/bookclub.schema';
import { CreateBookClubDto } from '../../../../dto/src/lib/bookclub.dto';

@Controller('book-club')
export class BookClubController {
    private readonly logger = new Logger(BookClubController.name);

    constructor(private bookClubService: BookClubService) {}

    @Get('')
    async getAll(): Promise<BookClub[]> {
        this.logger.log('Fetching all book clubs');
        return this.bookClubService.getBookClubs();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<BookClub | null> {
        this.logger.log(`Fetching book club with ID: ${id}`);
        return this.bookClubService.getBookClubById(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    async create(
        @Body() createBookClubDto: CreateBookClubDto,
        @Request() req: any
    ): Promise<BookClub> {
        const userId = req.user.user_id;
        this.logger.log(`User ${userId} is creating a new book club`);
        return this.bookClubService.createBookClub(
            createBookClubDto.name,
            createBookClubDto.description,
            userId
        );
    }

    @Put(':id/edit')
    @UseGuards(AuthGuard)
    async editBookClub(
        @Param('id') bookClubId: string,
        @Body() body: CreateBookClubDto,
        @Request() req: any
    ): Promise<BookClub> {
        const userId = req.user.user_id;
        this.logger.log(
            `User ${userId} is editing book club with ID: ${bookClubId}`
        );
        return this.bookClubService.editBookClub(
            bookClubId,
            body.name,
            body.description,
            userId
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
        const userId = req.user.user_id;
        this.logger.log(`User ${userId} is deleting book club with ID: ${id}`);
        const success = await this.bookClubService.deleteBookClub(id, userId);
        if (!success) {
            throw new HttpException(
                'Book club not found',
                HttpStatus.NOT_FOUND
            );
        }
    }

    @Get(':id')
    async getBookClubDetails(
        @Param('id') id: string
    ): Promise<BookClub | null> {
        return this.bookClubService.getBookClubById(id);
    }

    @Post(':id/add-book')
    @UseGuards(AuthGuard)
    async addBookToClub(
        @Param('id') bookClubId: string,
        @Body() body: { bookId: string },
        @Request() req: any
    ): Promise<BookClub> {
        const userId = req.user.user_id;
        this.logger.log(
            `User ${userId} is adding a book to book club ${bookClubId}`
        );
        return this.bookClubService.addBookToClub(
            bookClubId,
            body.bookId,
            userId
        );
    }

    @Delete(':id/remove-book/:bookId')
    @UseGuards(AuthGuard)
    async removeBookFromClub(
        @Param('id') bookClubId: string,
        @Param('bookId') bookId: string,
        @Request() req: any
    ): Promise<BookClub> {
        const userId = req.user.user_id;
        this.logger.log(
            `User ${userId} is removing book ${bookId} from book club ${bookClubId}`
        );
        return this.bookClubService.removeBookFromClub(
            bookClubId,
            bookId,
            userId
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteBookClub(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<void> {
        const userId = req.user.user_id; // Haal de ID van de ingelogde gebruiker op
        this.logger.log(
            `User ${userId} is attempting to delete book club with ID: ${id}`
        );
        const success = await this.bookClubService.deleteBookClub(id, userId);
        if (!success) {
            throw new HttpException(
                'Book club not found or unauthorized',
                HttpStatus.NOT_FOUND
            );
        }
    }

    
}
