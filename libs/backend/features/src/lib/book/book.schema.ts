import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookGenre, IUserIdentity } from '@avans-nx-workshop/shared/api';
import { IBook } from '@avans-nx-workshop/shared/api';

export type BookDocument = Book & Document;

@Schema()
export class Review {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) // Verwijzing naar een gebruiker
    userId!: string;

    @Prop({ required: true })
    comment!: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating!: number; // Bijvoorbeeld een cijfer tussen 1-5
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

@Schema()
export class Book implements IBook {
    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    author!: string;

    @Prop({ required: true, type: String }) // Opslaan als string voor eenvoud
    publicationYear!: string; 

    @Prop({ required: true, enum: BookGenre, type: String })
    genre!: BookGenre;

    @Prop({
        required: true,
        type: {
            user_id: String,
            name: String,
            emailAddress: String,
            profileImgUrl: { type: String, required: false },
            role: String,
            token: { type: String, required: false },
        },
    })
    addedBy!: IUserIdentity;

    @Prop({
        type: [ReviewSchema], // Een array van Review-subdocumenten
        default: [],
    })
    reviews!: Review[]; // Lijst met reviews
    

    @Prop({ 
        type: String, 
        default: function (this: Document) {
            return this._id.toString(); // Gebruik het standaard gegenereerde `_id` als waarde voor `id`
        },
    })
    id!: string; // Maak `id` een alias voor `_id`

    
}

export const BookSchema = SchemaFactory.createForClass(Book);
