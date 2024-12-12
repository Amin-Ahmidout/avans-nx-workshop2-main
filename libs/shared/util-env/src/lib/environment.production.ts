import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,

    ROOT_DOMAIN_URL: 'https://book-data-api.azurewebsites.net/',
    dataApiUrl: 'https://book-data-api.azurewebsites.net/api',
    rcmndApiUrl: 'http://localhost:3100/api',

    MONGO_DB_CONNECTION_STRING: 'mongodb+srv://admin:admin@cluster0.pkmgh.mongodb.net/BookDb?retryWrites=true&w=majority&appName=Cluster0',
    RCMND_NEO4J_DB_HOST: 'ea67c60d.databases.neo4j.io',
    RCMND_NEO4J_DB_PORT: 7687,
    RCMND_NEO4J_DB_USER: 'neo4j',
    RCMND_NEO4J_DB_PASSWORD: 'U2QzEO27_FBzG7VHVu2fsc3t8UY9ccRh4fdoP9ODoQc'
};
