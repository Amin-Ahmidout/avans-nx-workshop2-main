import { Id } from './id.type';
import { IUserIdentity } from './user.interface';

export interface IBookClub {
    id: Id;
    name: string;
    description: string;
    owner: IUserIdentity; // Eigenaar van de bookclub
    members: IUserIdentity[]; // Leden van de bookclub
}

export type ICreateBookClub = Pick<IBookClub, 'name' | 'description'>;
export type IUpdateBookClub = Partial<Omit<IBookClub, 'id'>>;
export type IUpsertBookClub = IBookClub;
