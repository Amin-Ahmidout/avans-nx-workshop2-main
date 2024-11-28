/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    AllExceptionsFilter,
    HttpExceptionFilter,
    ApiResponseInterceptor
} from '@avans-nx-workshop/backend/dto';
import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
    try {
        Logger.log('Starting application bootstrap process...');

        const app = await NestFactory.create(AppModule);
        Logger.log('NestJS application created successfully.');

        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        Logger.log(`Global prefix set to: ${globalPrefix}`);

        const corsOptions: CorsOptions = {};
        app.enableCors(corsOptions);
        Logger.log('CORS is enabled with options:', corsOptions);

        app.useGlobalInterceptors(new ApiResponseInterceptor());
        Logger.log('Global response interceptor registered.');

        app.useGlobalPipes(new ValidationPipe());
        Logger.log('Validation pipes are enabled.');

        // Uncomment and debug if you want to use the exception filter
        // app.useGlobalFilters(new HttpExceptionFilter());
        // Logger.log('HTTP Exception filter is enabled.');

        const port = process.env.PORT || 3000;
        await app.listen(port);
        Logger.log(`🚀 DATA-API server is running on: http://localhost:${port}/${globalPrefix}`);
    } catch (error) {
        Logger.error('Application failed to start:', error.message);
        Logger.error(error.stack);
        process.exit(1); // Beëindig het proces met een foutcode
    }
}

// Global exception and rejection handlers for debugging purposes
process.on('uncaughtException', (error) => {
    Logger.error('Unhandled Exception occurred:', error.message);
    Logger.error(error.stack);
});

process.on('unhandledRejection', (reason: any, promise) => {
    Logger.error('Unhandled Rejection detected:', JSON.stringify(reason));
});

bootstrap();
