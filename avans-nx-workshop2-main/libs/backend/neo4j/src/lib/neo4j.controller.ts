import { Controller, Get } from '@nestjs/common';
import { Neo4JUserService } from './neo4j-users.service';

@Controller('users')
export class Neo4JExampleController {
    constructor(private readonly neo4jService: Neo4JUserService) {}

    @Get('')
    async getAllUsers(): Promise<any> {
        const results = await this.neo4jService.findAll();
        return results;
    }
}
