import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate
} from 'class-validator';
import {
    ICreateMeal,
    IUpdateMeal,
    IUpsertMeal,
    IUserIdentity,
    MealSort
} from '@avans-nx-workshop/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateMealDto implements ICreateMeal {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    sort!: MealSort;
}

export class UpsertMealDto implements IUpsertMeal {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsBoolean()
    @IsNotEmpty()
    isVega!: boolean;

    @IsDate()
    @IsNotEmpty()
    dateServed!: Date;

    @IsString()
    @IsNotEmpty()
    sort!: MealSort;

    // @IsNotEmpty()
    cook!: IUserIdentity;
}

export class UpdateMealDto implements IUpdateMeal {
    @IsString()
    @IsOptional()
    title!: string;

    @IsString()
    @IsOptional()
    description!: string;
}
