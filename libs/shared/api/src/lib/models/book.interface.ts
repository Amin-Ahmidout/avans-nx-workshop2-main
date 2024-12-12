import { Id } from './id.type';
import { IUserIdentity } from './user.interface';
import { IReview } from './review.interface';

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
    publicationYear: string;
    genre: BookGenre;
    addedBy: IUserIdentity;
    reviews?: IReview[];
}

export type ICreateBook = Pick<IBook, 'title' | 'description' | 'genre'>;
export type IUpdateBook = Partial<Omit<IBook, 'id'>>;
export type IUpsertBook = IBook;
