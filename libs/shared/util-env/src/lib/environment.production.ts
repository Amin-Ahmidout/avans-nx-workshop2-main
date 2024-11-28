import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,

    ROOT_DOMAIN_URL: 'https://book-data-api.azurewebsites.net/',
    dataApiUrl: 'https://book-data-api.azurewebsites.net/api',

    MONGO_DB_CONNECTION_STRING: 'mongodb+srv://admin:admin@cluster0.pkmgh.mongodb.net/BookDb?retryWrites=true&w=majority&appName=Cluster0'
};
