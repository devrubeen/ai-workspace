import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
    constructor(
        private readonly supabaseService: SupabaseService,
    ) { }

    async create(
        createOrganizationDto: CreateOrganizationDto,
        ownerId: string,
    ) {
        const { name, slug, description } =
            createOrganizationDto;

        const { data, error } =
            await this.supabaseService
                .getClient()
                .from('organizations')
                .insert({
                    name,
                    slug,
                    description,
                    owner_id: ownerId,
                })
                .select()
                .single();

        if (error) {
            console.error('SUPABASE ORGANIZATION ERROR:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint,
            });

            if (error.code === '23505') {
                throw new ConflictException(
                    'Ya existe una organización con ese slug',
                );
            }

            throw new InternalServerErrorException(error.message);
        }

        return {
            message: 'Organización creada correctamente',
            organization: data,
        };
    }

    async testInsert() {
        const { data, error } =
            await this.supabaseService
                .getClient()
                .from('organizations')
                .insert({
                    name: 'Organización de prueba administrativa',
                    slug: `test-${Date.now()}`,
                    description: 'Prueba temporal',
                    owner_id: '3feaf03b-d00b-432f-9ae3-3890c10c171a',
                })
                .select()
                .single();

        console.log('TEST INSERT DATA:', data);
        console.log('TEST INSERT ERROR:', error);

        return {
            data,
            error,
        };
    }
}

// Recibe los datos validados.

// Recibe el ownerId desde el JWT.

// Inserta la organización en Supabase.

// Guarda el usuario autenticado como owner_id.

// Devuelve la organización creada.

// Evita duplicar el mismo slug.