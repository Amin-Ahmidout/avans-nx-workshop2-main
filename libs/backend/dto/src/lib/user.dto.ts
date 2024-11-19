import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import {
    // ICreateUser,
    IUpdateUser,
    IUpsertUser,
    IUserRegistration,
    Id,
    UserGender,
    UserRole
} from '@avans-nx-workshop/shared/api';
import { Meal } from '@avans-nx-workshop/backend/features';

export class CreateUserDto implements IUserRegistration {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    emailAddress!: string;
}

export class UpsertUserDto implements IUpsertUser {
    _id!: Id;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    emailAddress!: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

    @IsString()
    @IsNotEmpty()
    profileImgUrl = '';

    @IsString()
    @IsNotEmpty()
    meals: Meal[] = [];

    @IsString()
    @IsNotEmpty()
    role: UserRole = UserRole.Unknown;

    @IsString()
    @IsNotEmpty()
    gender: UserGender = UserGender.Unknown;
}

export class UpdateUserDto implements IUpdateUser {
    _id?: string | undefined;

    @IsString()
    @IsOptional()
    name!: string;
}
