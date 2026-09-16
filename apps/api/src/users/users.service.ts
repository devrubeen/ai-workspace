import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly supabaseService: SupabaseService,
    ) { }

    async getProfileById(userId: string) {
        const { data, error } =
            await this.supabaseService
                .getClient()
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}