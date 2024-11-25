import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book as BookModel, BookDocument } from './book.schema';
import { IBook } from '@avans-nx-workshop/shared/api';
import { CreateBookDto, UpdateBookDto } from '@avans-nx-workshop/backend/dto';
import {
    UserDocument,
    User as UserModel,
} from '@avans-nx-workshop/backend/user';

@Injectable()
export class BookService {
    private readonly logger: Logger = new Logger(BookService.name);

    constructor(
        @InjectModel(BookModel.name) private bookModel: Model<BookDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    ) {}

    /**
     * Haal alle boeken op uit de database
     * @returns Lijst van boeken
     */
    async findAll(): Promise<IBook[]> {
        this.logger.log(`Finding all books`);
        const books = await this.bookModel
            .find()
            .populate('addedBy', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return books;
    }

    /**
     * Haal een boek op met een specifieke ID
     * @param _id Boek ID
     * @returns Boekdetails of null als niet gevonden
     */
    async findOne(_id: string): Promise<IBook | null> {
        this.logger.log(`Finding book with id ${_id}`);
        const book = await this.bookModel.findOne({ _id }).exec();
        if (!book) {
            this.logger.debug('Book not found');
        }
        return book;
    }

    /**
     * Maak een nieuw boek aan
     * @param req Request met boekgegevens
     * @returns Gemaakt boek
     */
    async create(req: any): Promise<IBook | null> {
        const bookData = req.body;

        if (!bookData.publicationYear) {
            throw new HttpException('Publication year is required', 400);
        }

        if (typeof bookData.publicationYear !== 'string' || isNaN(Number(bookData.publicationYear))) {
            throw new HttpException('Publication year must be a valid string representing a year', 400);
        }

        this.logger.log(`Creating book "${bookData.title}" with author "${bookData.author}"`);
        const createdBook = {
            ...bookData,
            addedBy: req.user, // Bewaar de gegevens van de ingelogde gebruiker voor tracking
        };
        return this.bookModel.create(createdBook);
    }

    /**
     * Update een bestaand boek
     * @param id Boek ID
     * @param updateBookDto Boekgegevens die geüpdatet moeten worden
     * @returns Geüpdatet boek of null als niet gevonden
     */
    async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<IBook | null> {
        if (
            updateBookDto.publicationYear &&
            (typeof updateBookDto.publicationYear !== 'string' || isNaN(Number(updateBookDto.publicationYear)))
        ) {
            throw new HttpException('Publication year must be a valid string representing a year', 400);
        }

        const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {
            new: true, // Return the updated document
        }).exec();

        if (!updatedBook) {
            this.logger.warn(`Book with ID ${id} not found`);
            return null;
        }

        this.logger.log(`Book with ID ${id} successfully updated`);
        return updatedBook;
    }

    /**
     * Verwijder een boek op basis van ID
     * @param id Boek ID
     * @returns Boolean of het boek succesvol is verwijderd
     */
    async deleteBookById(id: string): Promise<boolean> {
        const result = await this.bookModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }
}
