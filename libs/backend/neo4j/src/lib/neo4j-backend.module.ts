import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4JExampleController } from './neo4j.controller';
import { Neo4JUserService } from './neo4j-users.service';
import { BookNeo4jController } from './neo4j-book/neo4j-book.controller';
import { BookNeo4jService } from './neo4j-book/neo4j-book.service';
import { BackendFeaturesBookModule } from '@avans-nx-workshop/backend/features';

@Module({
    imports: [Neo4jModule, BackendFeaturesBookModule],
    controllers: [Neo4JExampleController, BookNeo4jController],
    providers: [Neo4JUserService, BookNeo4jService],
    exports: [],
})
export class Neo4jBackendModule {}
