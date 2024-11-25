import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: true,

    ROOT_DOMAIN_URL: 'https://nxworkshop.azurewebsites.net',
    dataApiUrl: 'https://nxworkshop.azurewebsites.net/api',

    MONGO_DB_CONNECTION_STRING: 'mongodb+srv://admin:Admin123!@cluster0.pkmgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
};
