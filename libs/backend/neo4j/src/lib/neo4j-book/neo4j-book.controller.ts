import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookNeo4jService } from './neo4j-book.service';

@ApiTags('Neo4j Books')
@Controller('rcmnd')
export class BookNeo4jController {
    constructor(private readonly bookNeo4jService: BookNeo4jService) {}

    @ApiOperation({ summary: 'Synchroniseer boeken met Neo4j' })
    @Post('sync')
    async syncBooks() {
        await this.bookNeo4jService.syncBooks();
        return { message: 'Boeken gesynchroniseerd naar Neo4j' };
    }

    @ApiOperation({ summary: 'Haal populairste boeken op' })
    @Get('popular')
    async getPopularBooks() {
        const popularBooks = await this.bookNeo4jService.getPopularBooks();
        console.log('Popular Books:', popularBooks); // Debug log
        return popularBooks;
    }

    @ApiOperation({ summary: 'Haal best beoordeelde boeken op' })
    @Get('best-rated')
    async getBestRatedBooks() {
        return this.bookNeo4jService.getBestRatedBooks();
    }
}
