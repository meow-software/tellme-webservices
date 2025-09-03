import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')  {
    // Exemple : Gestion personnalisée des erreurs
    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (err || !user) {
            throw new UnauthorizedException('Invalid or expired token.');
        }
        return user;
    }

    // Exemple : Logging
    canActivate(context: ExecutionContext) {
        console.log('JWT Guard activé depuis Atlas');
        return super.canActivate(context);
    }
}
