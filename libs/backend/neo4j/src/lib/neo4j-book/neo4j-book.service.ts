import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { BookService } from '../../../../features/src/lib/book/book.service';
import { UserService } from '../../../../user/src/lib/user/user.service';

@Injectable()
export class BookNeo4jService implements OnApplicationBootstrap {
    private readonly logger: Logger = new Logger(BookNeo4jService.name);

    constructor(
        private readonly neo4jService: Neo4jService,
        private readonly mongoBookService: BookService,
        private readonly mongoUserService: UserService
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        this.logger.log('Starting book and user sync with Neo4j...');
        try {
            await this.syncBooks();
            this.logger.log('Book synchronization with Neo4j completed.');
            await this.syncUsers();
            this.logger.log('User synchronization with Neo4j completed.');
        } catch (error) {
            this.logger.error('Error during synchronization with Neo4j:', error);
        }
    }

    // Synchroniseer boeken en reviews naar Neo4j
    async syncBooks(): Promise<void> {
        const books = await this.mongoBookService.findAll();

        for (const book of books) {
            try {
                this.logger.log(`Synchronizing book: ${book.title}`);
                
                // Bereken gemiddelde beoordeling
                const averageRating = book.reviews?.length
                    ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
                    : 0;

                // Voeg boek toe aan Neo4j
                await this.neo4jService.write(
                    `
                    MERGE (b:Book {id: $bookId})
                    SET b.title = $title, 
                        b.author = $author, 
                        b.genre = $genre, 
                        b.publicationYear = $publicationYear, 
                        b.averageRating = $averageRating
                    `,
                    {
                        bookId: book.id,
                        title: book.title,
                        author: book.author,
                        genre: book.genre,
                        publicationYear: book.publicationYear,
                        averageRating
                    }
                );

                // Voeg reviews toe
                for (const review of book.reviews || []) {
                    const user = await this.mongoUserService.findOne(review.userId);
                    if (user) {
                        await this.neo4jService.write(
                            `
                            MATCH (b:Book {id: $bookId})
                            MERGE (u:User {id: $userId})
                            SET u.name = $userName, u.email = $userEmail
                            MERGE (u)-[:WROTE_REVIEW {comment: $comment, rating: $rating}]->(b)
                            `,
                            {
                                bookId: book.id,
                                userId: user._id.toString(),
                                userName: user.name,
                                userEmail: user.emailAddress,
                                comment: review.comment,
                                rating: review.rating
                            }
                        );
                    }
                }
            } catch (error) {
                this.logger.error(`Failed to sync book: ${book.title}`, error);
            }
        }
    }

    // Synchroniseer gebruikers en favorieten naar Neo4j
    async syncUsers(): Promise<void> {
        const users = await this.mongoUserService.findAll();

        for (const user of users) {
            try {
                this.logger.log(`Synchronizing user: ${user.name}`);
                
                // Voeg gebruiker toe aan Neo4j
                await this.neo4jService.write(
                    `
                    MERGE (u:User {id: $userId})
                    SET u.name = $name, 
                        u.email = $email,
                        u.profileImgUrl = $profileImgUrl,
                        u.role = $role,
                        u.gender = $gender,
                        u.isActive = $isActive
                    `,
                    {
                        userId: user._id.toString(),
                        name: user.name,
                        email: user.emailAddress,
                        profileImgUrl: user.profileImgUrl || '',
                        role: user.role || 'Guest',
                        gender: user.gender || 'Unknown',
                        isActive: Boolean(user.isActive)
                    }
                );

                // Voeg favoriete boeken toe als relaties
                for (const bookId of user.favoriteBooks || []) {
                    await this.neo4jService.write(
                        `
                        MATCH (b:Book {id: $bookId})
                        MERGE (u:User {id: $userId})
                        MERGE (u)-[:FAVORITES]->(b)
                        `,
                        {
                            userId: user._id.toString(),
                            bookId: bookId.toString()
                        }
                    );
                }
            } catch (error) {
                this.logger.error(`Failed to sync user: ${user.name}`, error);
            }
        }
    }

    // Haal populairste boeken op
    async getPopularBooks(): Promise<any[]> {
        const query = `
          MATCH (b:Book)<-[:FAVORITES]-(u:User)
          OPTIONAL MATCH (u)-[r:WROTE_REVIEW]->(b)
          RETURN b, COUNT(u) AS favorites, COLLECT(r) AS reviews
          ORDER BY favorites DESC
          LIMIT 10
        `;
        const result = await this.neo4jService.read(query);

        return result.records.map((record) => ({
            book: record.get('b').properties,
            favorites: record.get('favorites').toInt(),
            reviews: record.get('reviews').map((r: any) => ({
                comment: r.properties.comment,
                rating: r.properties.rating
            }))
        }));
    }

    // Haal best beoordeelde boeken op
    async getBestRatedBooks(): Promise<any[]> {
        const query = `
          MATCH (b:Book)
          OPTIONAL MATCH (u:User)-[r:WROTE_REVIEW]->(b)
          WITH b, AVG(r.rating) AS averageRating
          WHERE averageRating IS NOT NULL
          RETURN b.title AS title, b.author AS author, averageRating
          ORDER BY averageRating DESC
          LIMIT 10
        `;
        const result = await this.neo4jService.read(query);

        return result.records.map((record) => ({
            title: record.get('title'),
            author: record.get('author'),
            averageRating: record.get('averageRating')?.toFixed(2) || '0.00'
        }));
    }
}
