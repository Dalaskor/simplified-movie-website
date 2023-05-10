import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';
import { ROLES_KEY } from './roles-auth.decorator';
import { AUTH_SERVICE } from './service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      return this.authClient
        .send('validate_user_with_roles', { token, requiredRoles })
        .pipe(
          tap((res) => {
            this.addUser(res, context);
          }),
          catchError((e) => {
            console.error(e);
            throw new ForbiddenException('Нет доступа');
          }),
        );
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  private addUser(user: any, request: ExecutionContext) {
    request.switchToHttp().getRequest().user = user;
  }
}
