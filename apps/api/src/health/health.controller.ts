import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('health')
export class HealthController {
    constructor(
        private readonly supabaseService: SupabaseService,
    ) { }

    @Get('supabase')
    async checkSupabase() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('connection_test')
            .select('*')
            .limit(1);

        if (error) {
            return {
                status: 'error',
                message: 'No se pudo conectar con Supabase',
                error: error.message,
            };
        }

        return {
            status: 'ok',
            message: 'NestJS conectado con Supabase',
            data,
        };
    }
}