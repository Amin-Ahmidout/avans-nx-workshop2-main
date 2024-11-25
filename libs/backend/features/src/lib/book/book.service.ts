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
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IBook[]> {
        this.logger.log(`Finding all books`);
        const books = await this.bookModel
            .find()
            .populate('addedBy', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return books;
    }

    async findOne(_id: string): Promise<IBook | null> {
        this.logger.log(`Finding book with id ${_id}`);
        const book = await this.bookModel.findOne({ _id }).exec();
        if (!book) {
            this.logger.debug('Book not found');
        }
        return book;
    }

    async create(req: any): Promise<IBook | null> {
        const bookData = req.body;

        if (!bookData.publicationDate) {
            bookData.publicationDate = new Date();
        }

        if (bookData) {
            this.logger.log(`Creating book "${bookData.title}" with author "${bookData.author}"`);
            const createdBook = {
                ...bookData,
                addedBy: req.user, // Bewaar de gegevens van de ingelogde gebruiker voor tracking
            };
            return this.bookModel.create(createdBook);
        }
        return null;
    }

    async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<IBook | null> {
        // Controleer en converteer publicationDate naar een Date-object
        if (updateBookDto.publicationDate && typeof updateBookDto.publicationDate === 'string') {
          updateBookDto.publicationDate = new Date(updateBookDto.publicationDate);
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
      
      

    async deleteBookById(id: string): Promise<boolean> {
        const result = await this.bookModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0; 
      }
      
}
