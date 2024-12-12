export interface IEnvironment {
    production: boolean;

    ROOT_DOMAIN_URL: string;
    dataApiUrl: string;
    rcmndApiUrl: string;

    MONGO_DB_CONNECTION_STRING: string;

    RCMND_NEO4J_DB_HOST: string;
    RCMND_NEO4J_DB_PORT: number;
    RCMND_NEO4J_DB_USER: string;
    RCMND_NEO4J_DB_PASSWORD: string;
}
