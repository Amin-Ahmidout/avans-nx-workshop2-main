import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class Neo4JUserService {
    private readonly logger: Logger = new Logger(Neo4JUserService.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    async findAll(): Promise<any> {
        this.logger.log('findAll users');
        const results = await this.neo4jService.read(
            `MATCH people=()-[:WorksIn]->(t:Team {name:'Informatica'}) RETURN people;`
        );
        const users = results.records.map(
            (record: any) => record._fields[0].start.properties
        );
        return users;
    }
}
