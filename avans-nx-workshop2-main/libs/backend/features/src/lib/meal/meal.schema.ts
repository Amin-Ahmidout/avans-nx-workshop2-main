import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MealSort, IUserInfo } from '@avans-nx-workshop/shared/api';
import { IMeal } from '@avans-nx-workshop/shared/api';
import { IsMongoId } from 'class-validator';

export type MealDocument = Meal & Document;

@Schema()
export class Meal implements IMeal {
    @IsMongoId()
    id!: string;

    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    isVega!: boolean;

    @Prop({ required: true, default: new Date() })
    dateServed: Date = new Date();

    @Prop({ required: true, type: Object })
    sort!: MealSort;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    cook!: IUserInfo;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
