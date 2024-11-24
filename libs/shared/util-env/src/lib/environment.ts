import { IEnvironment } from './environment.interface';
import * as dotenv from 'dotenv';

dotenv.config();

export const environment: IEnvironment = {
  production: false,

  ROOT_DOMAIN_URL: process.env.ROOT_DOMAIN_URL || 'dummy',
  dataApiUrl: process.env.DATA_API_URL || 'dummy',

  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING || 'dummy',
};
