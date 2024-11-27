import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,

    ROOT_DOMAIN_URL: 'https://ashy-stone-03e313603.5.azurestaticapps.net',
    dataApiUrl: 'https://books-data-api.azurewebsites.net/',

    MONGO_DB_CONNECTION_STRING: 'mongodb+srv://admin:Admin123!@cluster0.pkmgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
};
