import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly supabaseService: SupabaseService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, full_name } = registerDto;

        const { data, error } =
            await this.supabaseService
                .getClient()
                .auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name,
                        },
                    },
                });

        if (error) {
            throw new BadRequestException(error.message);
        }

        return {
            message: 'Usuario registrado correctamente',
            user: data.user,
            session: data.session,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const { data, error } =
            await this.supabaseService
                .getClient()
                .auth.signInWithPassword({
                    email,
                    password,
                });

        if (error) {
            throw new UnauthorizedException(error.message);
        }

        return {
            message: 'Inicio de sesión correcto',
            user: data.user,
            session: data.session,
        };
    }

    async logout() {
        const { error } =
            await this.supabaseService
                .getClient()
                .auth.signOut();

        if (error) {
            throw new BadRequestException(error.message);
        }

        return {
            message: 'Sesión cerrada correctamente',
        };
    }
}