import { Module } from '@nestjs/common';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User as UserModel, UserSchema } from '@avans-nx-workshop/backend/user';
import { Book, Book as BookModel, BookSchema } from './book/book.schema';
import { BookClub as BookClubModel, BookClubSchema } from './bookclub/bookclub.schema';
import { AuthModule } from '@avans-nx-workshop/backend/auth';
import { JwtModule } from '@nestjs/jwt';
import { BookClubController } from './bookclub/bookclub-controller';
import { BookClubService } from './bookclub/bookclub-service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BookModel.name, schema: BookSchema },
            { name: UserModel.name, schema: UserSchema },
            {name: BookClubModel.name, schema: BookClubSchema}
        ]),
        JwtModule,
        AuthModule
    ],
    controllers: [BookController, BookClubController],
    providers: [BookService, BookClubService],
    exports: [BookService, BookClubService]
})
export class BackendFeaturesBookModule {}
