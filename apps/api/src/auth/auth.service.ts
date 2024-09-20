import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JwtPayload } from '@budgeting/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async validateJwt(token: string): Promise<User> {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET) as JwtPayload;
    return this.prisma.user.findUnique({ where: { id: decoded.userId } });
  }

  async signJwt(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      accountId: user.accountId,
      name: user.name,
    };

    const token = jwt.sign({
      // This sets the expiration to 1 day from now
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      ...payload,
    }, process.env.JWT_TOKEN_SECRET);

    return token;
  }

  async signInWithPassword(
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      accountId: user.accountId,
      name: user.name,
    };

    const token = jwt.sign({
      // This sets the expiration to 1 day from now
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      ...payload,
    }, process.env.JWT_TOKEN_SECRET);

    return token;
  }
}
