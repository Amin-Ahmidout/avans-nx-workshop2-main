import { Module } from '@nestjs/common';
import { MealController } from './meal/meal.controller';
import { MealService } from './meal/meal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User as UserModel, UserSchema } from '@avans-nx-workshop/backend/user';
import { Meal as MealModel, MealSchema } from './meal/meal.schema';
import { AuthModule } from '@avans-nx-workshop/backend/auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MealModel.name, schema: MealSchema },
            { name: UserModel.name, schema: UserSchema }
        ]),
        JwtModule,
        AuthModule
    ],
    controllers: [MealController],
    providers: [MealService],
    exports: [MealService]
})
export class BackendFeaturesMealModule {}
