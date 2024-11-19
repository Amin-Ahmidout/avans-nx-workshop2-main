import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Observable } from 'rxjs';

@Injectable()
export class UserExistGuard implements CanActivate {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const user = context.switchToHttp().getRequest().body;
        return !!this.userModel.findOne({ username: user.username });
    }
}
