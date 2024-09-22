import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RequestWithUser, SignInResponse } from '@budgeting/types';
import { PlaidService } from '@budgeting/plaid';
import { AuthGuard } from './auth.guard';

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly plaidService: PlaidService,
  ) {}

  @Post("link-token")
  @UseGuards(AuthGuard)
  async createLinkToken(
    @Req() req: RequestWithUser
  ): Promise<{ linkToken: string }> {
    const linkToken = await this.plaidService.createLinkToken(req.user.id);
  return { linkToken };
  }

  @Post("sign-in")
  async signInWithPassword(
    @Body() signInDto: SignInDto
  ): Promise<SignInResponse> {
    try {
      const jwt = await this.authService.signInWithPassword(signInDto.email, signInDto.password);
      const user = await this.authService.validateJwt(jwt);
      return { 
        jwt, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          accountId: user.accountId,
        }
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
