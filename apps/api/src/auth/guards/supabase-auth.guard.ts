import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Request } from 'express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    private readonly supabaseUrl = process.env.SUPABASE_URL;

    private readonly jwks = createRemoteJWKSet(
        new URL(`${this.supabaseUrl}/auth/v1/.well-known/jwks.json`),
    );

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Request>();

        const authorization =
            request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException(
                'Falta el encabezado Authorization',
            );
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException(
                'Formato de token inválido',
            );
        }

        try {
            const { payload } = await jwtVerify(
                token,
                this.jwks,
                {
                    issuer: `${this.supabaseUrl}/auth/v1`,
                },
            );

            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException(
                'Token inválido o expirado',
            );
        }
    }
}