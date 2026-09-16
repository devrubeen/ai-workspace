import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    createClient,
    SupabaseClient,
} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly client: SupabaseClient;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const supabaseUrl =
            this.configService.get<string>('SUPABASE_URL');

        const supabaseSecretKey =
            this.configService.get<string>(
                'SUPABASE_SERVICE_ROLE_KEY',
            );

        if (!supabaseUrl || !supabaseSecretKey) {
            throw new Error(
                'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el archivo .env',
            );
        }

        console.log('SUPABASE URL:', supabaseUrl);
        console.log(
            'SUPABASE KEY PREFIX:',
            supabaseSecretKey.slice(0, 20),
        );
        console.log(
            'SUPABASE KEY LENGTH:',
            supabaseSecretKey.length,
        );

        this.client = createClient(
            supabaseUrl,
            supabaseSecretKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                    detectSessionInUrl: false,
                },
                global: {
                    headers: {
                        // No añadimos aquí el Authorization del usuario
                    },
                },
            },
        );
    }

    getClient(): SupabaseClient {
        return this.client;
    }
}