import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { AuthService } from "./auth.service";  // Update this line

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies['jwt'];
    if (!cookie) {
      throw new HttpException("Sign in required", HttpStatus.UNAUTHORIZED);
    }

    try {
      request['user'] = await this.authService.validateJwt(cookie);
    } catch (error) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
