import { Neo4jBackendModule } from '@avans-nx-workshop/backend/neo4j';
import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
    imports: [
        Neo4jModule.forRoot({
            scheme: 'bolt+s',
            host: 'd5e40bc7.databases.neo4j.io',
            port: 7687,
            username: process.env.NEO4J_USER,
            password: process.env.NEO4J_PASSWORD
        }),
        Neo4jBackendModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
