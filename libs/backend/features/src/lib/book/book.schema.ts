import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookGenre, IUserIdentity } from '@avans-nx-workshop/shared/api';
import { IBook } from '@avans-nx-workshop/shared/api';

export type BookDocument = Book & Document;

@Schema()
export class Book implements IBook {
    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    author!: string;

    @Prop({ required: true })
    publicationDate!: Date;

    @Prop({ required: true, enum: BookGenre, type: String })
    genre!: BookGenre;

    @Prop({ required: true, type: Object })
    addedBy!: IUserIdentity;

    @Prop({ type: String, required: true }) // Mongoose gebruikt standaard een ObjectId, maar dit kan expliciet een string zijn.
    id!: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
