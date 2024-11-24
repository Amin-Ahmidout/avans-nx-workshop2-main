import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsOptional,
} from 'class-validator';
import {
    ICreateBook,
    IUpdateBook,
    IUpsertBook,
    IUserIdentity,
    BookGenre,
} from '@avans-nx-workshop/shared/api';

/**
 * DTO for creating a new book.
 */
export class CreateBookDto implements ICreateBook {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    genre!: BookGenre;
}

/**
 * DTO for upserting (create or update) a book.
 */
export class UpsertBookDto implements IUpsertBook {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    author!: string;

    @IsDate()
    @IsNotEmpty()
    publicationDate!: Date;

    @IsString()
    @IsNotEmpty()
    genre!: BookGenre;

    // `addedBy` represents the user who added the book
    @IsNotEmpty()
    addedBy!: IUserIdentity;
}

/**
 * DTO for updating a book. Allows partial updates.
 */
export class UpdateBookDto implements IUpdateBook {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsDate()
    @IsOptional()
    publicationDate?: Date;

    @IsString()
    @IsOptional()
    genre?: BookGenre;

    @IsOptional()
    addedBy?: IUserIdentity;
}
