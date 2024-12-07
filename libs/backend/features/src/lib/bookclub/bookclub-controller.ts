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

@Put(':id')
@UseGuards(AuthGuard)
async update(
    @Param('id') bookClubId: string,
    @Body() body: CreateBookClubDto,
    @Request() req: any
): Promise<BookClub | null> {
    const userId = req.user.user_id;
    this.logger.log(`User ${userId} is updating book club with ID: ${bookClubId}`);
    return this.bookClubService.updateBookClub(
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

    @Post(':id/join')
    @UseGuards(AuthGuard)
    async join(
        @Param('id') bookClubId: string,
        @Request() req: any
    ): Promise<BookClub> {
        const userId = req.user.user_id;
        this.logger.log(
            `User ${userId} is joining book club with ID: ${bookClubId}`
        );
        return this.bookClubService.joinBookClub(bookClubId, userId);
    }
}
