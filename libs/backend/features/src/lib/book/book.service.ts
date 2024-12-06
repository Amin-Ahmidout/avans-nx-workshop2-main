import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book as BookModel, BookDocument, Review } from './book.schema';
import { IBook } from '@avans-nx-workshop/shared/api';
import { IUserInfo } from '@avans-nx-workshop/shared/api';
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
    async updateBook(id: string, updateBookDto: UpdateBookDto, userId: string): Promise<IBook | null> {
        // Zoek het boek op basis van ID
        const book = await this.bookModel.findById(id).exec();
    
        // Controleer of het boek bestaat
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    
        // Controleer of de ingelogde gebruiker de eigenaar is van het boek
        if (book.addedBy?.user_id?.toString() !== userId.toString()) {
            throw new HttpException('You are not authorized to update this book', HttpStatus.FORBIDDEN);
        }
    
        // Update het boek als de controle slaagt
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {
            new: true, // Retourneer het geüpdatete document
        }).exec();
    
        return updatedBook;
    }
    
    async addBookToFavorites(userId: string, bookId: string): Promise<IUserInfo> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        if (user.favoriteBooks.includes(bookId)) {
            throw new HttpException('Book is already in favorites', HttpStatus.BAD_REQUEST);
        }
    
        user.favoriteBooks.push(bookId);
        await user.save();
        return user;
    }
    
    async addReview(bookId: string, userId: string, comment: string, rating: number): Promise<IBook> {
        const book = await this.bookModel.findById(bookId);

        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        book.reviews.push({ userId, comment, rating });
        await book.save();

        return book;
    }

    async getReviews(bookId: string): Promise<Review[]> {
        const book = await this.bookModel.findById(bookId).select('reviews').exec();

        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }

        return book.reviews;
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
