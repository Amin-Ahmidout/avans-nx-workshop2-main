import { Controller, Logger, Request } from '@nestjs/common';
import { MealService } from './meal.service';
import { Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { IMeal } from '@avans-nx-workshop/shared/api';
import { CreateMealDto } from '@avans-nx-workshop/backend/dto';
import { AuthGuard } from '@avans-nx-workshop/backend/auth';

@Controller('meal')
export class MealController {
    private readonly logger = new Logger(MealController.name);

    constructor(private mealService: MealService) {}

    @Get('')
    getAll(): Promise<IMeal[]> {
        return this.mealService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IMeal | null> {
        return this.mealService.findOne(id);
    }

    /**
     * Create a new Meal. The cook is the user that creates the new document in the DB.
     * De _id van de user wordt via het token meegestuurd - dus NIET als veld in de body!
     * De AuthGuard is een filter dat via middleware wordt aangeroepen voordat de Controller
     * het reqest ontvangt. De AuthGuard geeft de rout handling door via de next() functie.
     *
     * @param req Het binnenkomend request. Deze bevat de req.body die in het request is gestuurd,
     * én bevat de user_id die door de AuthGuard uit het Bearer token is gelezen. Bekijk de AuthGuard!
     * @returns
     */
    @Post('')
    @UseGuards(AuthGuard)
    create(@Request() req: any): Promise<IMeal | null> {
        this.logger.log('req.user.user_id = ', req.user.user_id);
        return this.mealService.create(req);
    }
}
