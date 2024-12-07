import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookClubDocument = BookClub & Document;

@Schema()
export class BookClub {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
    members!: string[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    owner!: string;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Book', default: [] })
    books!: string[];
}

export const BookClubSchema = SchemaFactory.createForClass(BookClub);
