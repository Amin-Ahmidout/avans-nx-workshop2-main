import { Id } from './id.type';
import { IUserIdentity } from './user.interface';

export enum BookGenre {
    Fiction = 'Fiction',
    NonFiction = 'NonFiction',
    Mystery = 'Mystery',
    Fantasy = 'Fantasy',
    Other = 'Other'
}

export interface IBook {
    id: Id;
    title: string;
    description: string;
    author: string;
    publicationDate: Date;
    genre: BookGenre;
    addedBy: IUserIdentity;
}

export type ICreateBook = Pick<IBook, 'title' | 'description' | 'genre'>;
export type IUpdateBook = Partial<Omit<IBook, 'id'>>;
export type IUpsertBook = IBook;
