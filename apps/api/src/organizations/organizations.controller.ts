import {
    Body,
    Controller,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
    constructor(
        private readonly organizationsService: OrganizationsService,
    ) { }

    @Post()
    @UseGuards(SupabaseAuthGuard)
    create(
        @Body() createOrganizationDto: CreateOrganizationDto,
        @Req() request: Request,
    ) {
        const ownerId = request.user?.sub;

        if (!ownerId) {
            throw new UnauthorizedException(
                'El token no contiene el identificador del usuario',
            );
        }

        return this.organizationsService.create(
            createOrganizationDto,
            ownerId,
        );
    }
}