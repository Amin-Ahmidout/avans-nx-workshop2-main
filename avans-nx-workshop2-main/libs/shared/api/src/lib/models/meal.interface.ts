import { Id } from './id.type';
import { IUserIdentity } from './user.interface';

export enum MealSort {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Other = 'Other'
}

export interface IMeal {
    id: Id;
    title: string;
    description: string;
    isVega: boolean;
    dateServed: Date;
    sort: MealSort;
    cook: IUserIdentity;
}

export type ICreateMeal = Pick<IMeal, 'title' | 'description' | 'sort'>;
export type IUpdateMeal = Partial<Omit<IMeal, 'id'>>;
export type IUpsertMeal = IMeal;
