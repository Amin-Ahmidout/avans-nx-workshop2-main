import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './user.schema';
import { IUser, IUserInfo } from '@avans-nx-workshop/shared/api';
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
        const items = await this.userModel.find();
        return items;
    }

    async findOne(_id: string): Promise<IUser | null> {
        this.logger.log(`Finding user with id ${_id}`);
        if (!Types.ObjectId.isValid(_id)) {
            this.logger.error(`Invalid ObjectId: ${_id}`);
            throw new HttpException(`Invalid ID format`, 400);
        }
        const item = await this.userModel.findById(new Types.ObjectId(_id)).exec();
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
        const createdItem = this.userModel.create(user);
        return createdItem;
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
    
    
}
