import { Module } from '@nestjs/common';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User as UserModel, UserSchema } from '@avans-nx-workshop/backend/user';
import { Book as BookModel, BookSchema } from './book/book.schema';
import { AuthModule } from '@avans-nx-workshop/backend/auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BookModel.name, schema: BookSchema },
            { name: UserModel.name, schema: UserSchema }
        ]),
        JwtModule,
        AuthModule
    ],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BackendFeaturesBookModule {}
