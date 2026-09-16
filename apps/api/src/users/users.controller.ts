import {
    Controller,
    Get,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Get('me')
    @UseGuards(SupabaseAuthGuard)
    getMe(@Req() request: Request) {
        const userId = request.user?.sub;

        if (!userId) {
            throw new UnauthorizedException(
                'El token no contiene el identificador del usuario',
            );
        }

        return this.usersService.getProfileById(userId);
    }
}