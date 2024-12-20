import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './user.schema';
import { IBook, IUser, IUserInfo } from '@avans-nx-workshop/shared/api';
// import { Meal, MealDocument } from '@avans-nx-workshop/backend/features';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument> // @InjectModel(Meal.name) private meetupModel: Model<MealDocument>
    ) {}

    async findAll(): Promise<IUserInfo[]> {
        this.logger.log(`Finding all items`);
        const items = await this.userModel
        .find()
        .populate('favoriteBooks');
        return items;
    }

    async findOne(_id: string): Promise<IUser | null> {
        this.logger.log(`Finding user with id ${_id}`);
        if (!Types.ObjectId.isValid(_id)) {
            this.logger.error(`Invalid ObjectId: ${_id}`);
            throw new HttpException(`Invalid ID format`, 400);
        }
        const item = await this.userModel.findById(new Types.ObjectId(_id))
        .populate('favoriteBooks')
        .exec();
        if (!item) {
            this.logger.debug('Item not found');
            throw new HttpException('User not found', 404);
        }
        return item;
    }

    async findOneByEmail(email: string): Promise<IUserInfo | null> {
        this.logger.log(`Finding user by email ${email}`);
        const item = this.userModel
            .findOne({ emailAddress: email })
            .select('-password')
            .exec();
        return item;
    }

    async create(user: CreateUserDto): Promise<IUserInfo> {
        this.logger.log(`Create user ${user.name}`);
        this.logger.log(`Received create payload: ${JSON.stringify(user)}`);
        const createdItem = this.userModel.create(user);
        return createdItem;
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await this.userModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
      }

    async update(_id: string, user: UpdateUserDto): Promise<IUserInfo | null> {
        this.logger.log(`Updating user with ID: ${_id}`);
        this.logger.log(`Received update payload: ${JSON.stringify(user)}`);
    
        if (!Types.ObjectId.isValid(_id)) {
            this.logger.error(`Invalid ObjectId format: ${_id}`);
            throw new HttpException('Invalid ID format', 400);
        }
    
        const objectId = new Types.ObjectId(_id);
        const updatedUser = await this.userModel.findByIdAndUpdate(
            objectId,
            user,
            { new: true }
        );
    
        if (!updatedUser) {
            this.logger.error(`User with ID ${_id} not found`);
            throw new HttpException(`User with ID ${_id} not found`, 404);
        }
    
        this.logger.log(`User updated successfully: ${JSON.stringify(updatedUser)}`);
        return updatedUser;
    }
    
    async findById(id: string): Promise<IUserInfo | null> {
        this.logger.log(`Finding user by ID: ${id}`);
    
        // Valideer of het ID-formaat correct is
        if (!Types.ObjectId.isValid(id)) {
            this.logger.error(`Invalid ObjectId format: ${id}`);
            throw new HttpException('Invalid ID format', 400);
        }
    
        // Zoek de gebruiker op in de database
        const user = await this.userModel.findById(new Types.ObjectId(id)).select('-password').exec();
    
        // Controleer of de gebruiker gevonden is
        if (!user) {
            this.logger.error(`User with ID ${id} not found`);
            throw new HttpException(`User with ID ${id} not found`, 404);
        }
    
        this.logger.log(`Found user: ${JSON.stringify(user)}`);
        return user;
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

    async getFavorites(userId: string): Promise<IBook[]> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new HttpException('Invalid user ID format', HttpStatus.BAD_REQUEST);
        }
    
        const user = await this.userModel
            .findById(userId)
            .populate('favoriteBooks') // Populeert de favoriete boeken
            .exec();
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        // Controleer of de gepopuleerde favorieten bestaan en retourneer deze
        if (Array.isArray(user.favoriteBooks)) {
            return user.favoriteBooks as IBook[];
        }
    
        return [];
    }
    
    
    
}
