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
import { Book } from '@avans-nx-workshop/backend/features';

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
    books: Book[] = [];

    @IsString()
    @IsNotEmpty()
    role: UserRole = UserRole.Unknown;

    @IsString()
    @IsNotEmpty()
    gender: UserGender = UserGender.Unknown;
}

export class UpdateUserDto implements IUpdateUser {
    @IsString()
    @IsNotEmpty()
    _id!: string; 
    
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    emailAddress?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsOptional()
    profileImgUrl?: string;

    @IsString()
    @IsOptional()
    role?: UserRole;

    @IsString()
    @IsOptional()
    gender?: UserGender;
}

