import { IsNotEmpty, IsString } from 'class-validator';
import { IUserIdentity } from '../../../../shared/api/src/lib/models/user.interface';
import {
    ICreateBookClub,
    IUpdateBookClub,
    IUpsertBookClub
} from '../../../../shared/api/src/lib/models/bookclub.interface';

/**
 * DTO for creating a new book club.
 */
export class CreateBookClubDto implements ICreateBookClub {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    // Owner wordt ingesteld in de backend, daarom niet opgenomen in de DTO
}

/**
 * DTO for updating a book club. Allows partial updates.
 */
export class UpdateBookClubDto implements IUpdateBookClub {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsNotEmpty()
    owner?: IUserIdentity;

    members?: IUserIdentity[]; // Optioneel bijwerken van leden
}

/**
 * DTO for upserting (create or update) a book club.
 */
export class UpsertBookClubDto implements IUpsertBookClub {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    owner!: IUserIdentity;

    members!: IUserIdentity[];
}
