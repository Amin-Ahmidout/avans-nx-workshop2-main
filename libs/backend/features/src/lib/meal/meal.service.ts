import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meal as MealModel, MealDocument } from './meal.schema';
import { IMeal } from '@avans-nx-workshop/shared/api';
import { CreateMealDto, UpdateMealDto } from '@avans-nx-workshop/backend/dto';
import {
    UserDocument,
    User as UserModel
} from '@avans-nx-workshop/backend/user';

@Injectable()
export class MealService {
    private readonly logger: Logger = new Logger(MealService.name);

    constructor(
        @InjectModel(MealModel.name) private mealModel: Model<MealDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IMeal[]> {
        this.logger.log(`Finding all items`);
        const items = await this.mealModel
            .find()
            .populate('cook', 'name emailAddress gender isActive profileImgUrl')
            .exec();
        return items;
    }

    async findOne(_id: string): Promise<IMeal | null> {
        this.logger.log(`finding meal with id ${_id}`);
        const item = await this.mealModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Item not found');
        }
        return item;
    }

    async create(req: any): Promise<IMeal | null> {
        const meal = req.body;
        const user_id = req.user.user_id;

        if (meal && user_id) {
            this.logger.log(`Create meal ${meal.title} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -meals -role -__v -isActive')
                .exec();
            const createdItem = {
                ...meal,
                cook: user
            };
            return this.mealModel.create(createdItem);
        }
        return null;
    }

    async update(_id: string, meal: UpdateMealDto): Promise<IMeal | null> {
        this.logger.log(`Update meal ${meal.title}`);
        return this.mealModel.findByIdAndUpdate({ _id }, meal);
    }
}
