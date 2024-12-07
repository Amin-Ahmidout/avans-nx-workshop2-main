import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookClub, BookClubDocument } from './bookclub.schema';

@Injectable()
export class BookClubService {
    constructor(
        @InjectModel(BookClub.name)
        private bookClubModel: Model<BookClubDocument>
    ) {}

    /**
     * Maak een nieuwe boekenclub aan
     * @param name Naam van de boekenclub
     * @param description Beschrijving van de boekenclub
     * @param owner Eigenaar van de boekenclub
     * @returns Gemaakte boekenclub
     */
    async createBookClub(
        name: string,
        description: string,
        owner: string
    ): Promise<BookClub> {
        const existingClub = await this.bookClubModel.findOne({ name });
        if (existingClub) {
            throw new HttpException('A book club with this name already exists', HttpStatus.CONFLICT);
        }
    
        const bookClub = new this.bookClubModel({
            name,
            description,
            owner,
            members: [owner],
        });
    
        return bookClub.save();
    }
    

    /**
     * Haal alle boekenclubs op
     * @returns Lijst van boekenclubs
     */
    async getBookClubs(): Promise<BookClub[]> {
        return this.bookClubModel
            .find()
            .populate('owner', 'name email') // Populate de `owner` met alleen `name` en `email`
            .populate('members', 'name email') // Populate de `members` als je dat ook nodig hebt
            .exec();
    }
    

    /**
     * Haal een specifieke boekenclub op
     * @param bookClubId ID van de boekenclub
     * @returns Boekenclub of null als deze niet bestaat
     */
    async getBookClubById(bookClubId: string): Promise<BookClub | null> {
        const bookClub = await this.bookClubModel
            .findById(bookClubId)
            .populate('members', 'name email')
            .exec();
        if (!bookClub) {
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }
        return bookClub;
    }

    /**
     * Laat een gebruiker lid worden van een boekenclub
     * @param bookClubId ID van de boekenclub
     * @param userId ID van de gebruiker
     * @returns Geüpdatete boekenclub
     */
    async joinBookClub(bookClubId: string, userId: string): Promise<BookClub> {
        const bookClub = await this.bookClubModel.findById(bookClubId);
        if (!bookClub) {
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }

        if (!bookClub.members.includes(userId)) {
            bookClub.members.push(userId);
        }
        return bookClub.save();
    }

    /**
     * Update een boekenclub
     * @param bookClubId ID van de boekenclub
     * @param name Nieuwe naam van de boekenclub
     * @param description Nieuwe beschrijving van de boekenclub
     * @param owner ID van de eigenaar
     * @returns Geüpdatete boekenclub
     */
    async updateBookClub(
        bookClubId: string,
        name: string,
        description: string,
        owner: string
    ): Promise<BookClub | null> {
        const bookClub = await this.bookClubModel.findById(bookClubId);
        if (!bookClub) {
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }

        if (bookClub.owner !== owner) {
            throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
        }

        bookClub.name = name;
        bookClub.description = description;

        return bookClub.save();
    }

    /**
     * Verwijder een boekenclub
     * @param bookClubId ID van de boekenclub
     * @param owner ID van de eigenaar
     * @returns Boolean of het verwijderen succesvol was
     */
    async deleteBookClub(bookClubId: string, owner: string): Promise<boolean> {
        const bookClub = await this.bookClubModel.findById(bookClubId);
        if (!bookClub) {
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }

        if (bookClub.owner !== owner) {
            throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
        }

        const result = await this.bookClubModel.deleteOne({ _id: bookClubId }).exec();
        return result.deletedCount > 0;
    }
}
