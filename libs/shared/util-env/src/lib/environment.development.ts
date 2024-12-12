import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,

    ROOT_DOMAIN_URL: 'http://localhost:3000',
    dataApiUrl: 'http://localhost:3000/api',
    rcmndApiUrl: 'http://localhost:3100/api',

    MONGO_DB_CONNECTION_STRING: 'mongodb://localhost:27017/BookDb',

    RCMND_NEO4J_DB_HOST: 'ea67c60d.databases.neo4j.io',
    RCMND_NEO4J_DB_PORT: 7687,
    RCMND_NEO4J_DB_USER: 'neo4j',
    RCMND_NEO4J_DB_PASSWORD: 'U2QzEO27_FBzG7VHVu2fsc3t8UY9ccRh4fdoP9ODoQc'
};
