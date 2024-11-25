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

    @Prop({ required: true, default: Date.now }) // Stel de publicatiedatum in op de huidige datum.
    publicationDate!: Date; 

    @Prop({ required: true, enum: BookGenre, type: String })
    genre!: BookGenre;

    @Prop({ required: true, type: Object })
    addedBy!: IUserIdentity;

    @Prop({ 
        type: String, 
        default: function (this: Document) {
            return this._id.toString(); // Gebruik het standaard gegenereerde `_id` als waarde voor `id`
        },
    })
    id!: string; // Maak `id` een alias voor `_id`

    
}

export const BookSchema = SchemaFactory.createForClass(Book);
