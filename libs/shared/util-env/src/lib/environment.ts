import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,

    ROOT_DOMAIN_URL: 'http://localhost:3000',
    dataApiUrl: 'http://localhost:3000/api',

    MONGO_DB_CONNECTION_STRING: 'mongodb+srv://admin:admin@cluster0.pkmgh.mongodb.net/BookDb?retryWrites=true&w=majority&appName=Cluster0'
};
