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
            throw new HttpException(
                'A book club with this name already exists',
                HttpStatus.CONFLICT
            );
        }

        const bookClub = new this.bookClubModel({
            name,
            description,
            owner,
            members: [owner]
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
            .populate('books', 'title author') // Populeer de boeken
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
            .populate('owner', 'name email') 
            .populate('members', 'name email') 
            .populate('books', 'title author') // Populeer de boeken
            .exec();
        if (!bookClub) {
            throw new HttpException(
                'Book club not found',
                HttpStatus.NOT_FOUND
            );
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
            throw new HttpException(
                'Book club not found',
                HttpStatus.NOT_FOUND
            );
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
    async editBookClub(
        bookClubId: string,
        name: string,
        description: string,
        userId: string
    ): Promise<BookClub> {
        console.log(`Attempting to edit book club with ID: ${bookClubId}`);
    
        const bookClub = await this.bookClubModel.findById(bookClubId);
        if (!bookClub) {
            console.error(`Book club with ID ${bookClubId} not found.`);
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }
        console.log(`Book club found: ${JSON.stringify(bookClub)}`);
    
        if (bookClub.owner.toString() !== userId.toString()) {
            console.error(`Authorization failed. Book club owner: ${bookClub.owner}, Request user: ${userId}`);
            throw new HttpException(
                'You are not authorized to edit this book club',
                HttpStatus.FORBIDDEN
            );
        }
        console.log(`Authorization successful. User ${userId} is the owner of the book club.`);
    
        console.log(`Updating book club with new values. Name: ${name}, Description: ${description}`);
        bookClub.name = name;
        bookClub.description = description;
    
        const updatedBookClub = await bookClub.save();
        console.log(`Book club updated successfully: ${JSON.stringify(updatedBookClub)}`);
        return updatedBookClub;
    }
    
    
    
    

    /**
     * Verwijder een boekenclub
     * @param bookClubId ID van de boekenclub
     * @param owner ID van de eigenaar
     * @returns Boolean of het verwijderen succesvol was
     */
    async deleteBookClub(bookClubId: string, userId: string): Promise<boolean> {
        const bookClub = await this.bookClubModel.findById(bookClubId);
    
        if (!bookClub) {
            console.error(`Book club with ID ${bookClubId} not found.`);
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }
    
        console.log(`Owner ID in DB: ${bookClub.owner}`);
        console.log(`User ID from request: ${userId}`);
    
        if (bookClub.owner.toString() !== userId.toString()) {
            console.error(
                `User ${userId} is not authorized to delete book club with ID ${bookClubId}.`
            );
            throw new HttpException(
                'You are not authorized to delete this book club',
                HttpStatus.FORBIDDEN
            );
        }
    
        const result = await this.bookClubModel.deleteOne({ _id: bookClubId }).exec();
        console.log(
            `Book club with ID ${bookClubId} deleted successfully: ${result.deletedCount > 0}`
        );
        return result.deletedCount > 0;
    }
    

    async addBookToClub(bookClubId: string, bookId: string, userId: string): Promise<BookClub> {
        const bookClub = await this.bookClubModel.findById(bookClubId);
    
        if (!bookClub) {
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }
    
        if (bookClub.owner.toString() !== userId.toString()) {
            throw new HttpException(
                'You are not authorized to add books to this book club',
                HttpStatus.FORBIDDEN
            );
        }
    
        if (!bookClub.books.includes(bookId)) {
            bookClub.books.push(bookId);
        }
    
        return bookClub.save();
    }
    
    async removeBookFromClub(bookClubId: string, bookId: string, userId: string): Promise<BookClub> {
        const bookClub = await this.bookClubModel.findById(bookClubId);
    
        if (!bookClub) {
            throw new HttpException('Book club not found', HttpStatus.NOT_FOUND);
        }
    
        if (bookClub.owner.toString() !== userId.toString()) {
            throw new HttpException(
                'You are not authorized to remove books from this book club',
                HttpStatus.FORBIDDEN
            );
        }
    
        bookClub.books = bookClub.books.filter((id) => id.toString() !== bookId);
    
        return bookClub.save();
    }
    
    
    
    
    
    
}
