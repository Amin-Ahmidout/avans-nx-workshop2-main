import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4jBackendModule } from '@avans-nx-workshop/backend/neo4j';
import { BackendFeaturesBookModule } from '@avans-nx-workshop/backend/features';
import { environment } from '@avans-nx-workshop/shared/util-env';

@Module({
    imports: [
        MongooseModule.forRoot(environment.MONGO_DB_CONNECTION_STRING),
        Neo4jModule.forRoot({
            scheme: 'neo4j+s',
            host: environment.RCMND_NEO4J_DB_HOST,
            port: environment.RCMND_NEO4J_DB_PORT,
            username: environment.RCMND_NEO4J_DB_USER,
            password: environment.RCMND_NEO4J_DB_PASSWORD,
        }),
        Neo4jBackendModule,
        BackendFeaturesBookModule,
        
    ],
})
export class AppModule {}
