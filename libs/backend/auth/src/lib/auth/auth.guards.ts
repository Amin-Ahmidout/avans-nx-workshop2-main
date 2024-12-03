import { UserService } from '../../../../user/src/lib/user/user.service';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService, private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.log('No token found');
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env['JWT_SECRET'] || 'secretstring'
            });
            this.logger.log('payload', payload);
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            
            const user = await this.userService.findOne(payload.user_id);

            
            if (!user) {
                this.logger.error(`User with ID ${payload.user_id} not found`);
                throw new UnauthorizedException('User not found');
            }


            request['user'] = {
                user_id: user._id,
                name: user.name,
                emailAddress: user.emailAddress,
                profileImgUrl: user.profileImgUrl,
                role: user.role,
            };
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
