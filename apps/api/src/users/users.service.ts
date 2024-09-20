import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}
  
  async create(
    createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    this.logger.debug(`Creating user with email: ${createUserDto.email}`);
    if (await this.emailExists(createUserDto.email)) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hash(createUserDto.password, 12),
      },
    });

    return plainToInstance(UserEntity, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    this.logger.debug(`Updating user with id: ${id.substring(0, 7)}`);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: await hash(updateUserDto.password, 12),
      },
    });

    return plainToInstance(UserEntity, updatedUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async emailExists(email: string) {
    this.logger.debug(`Checking if email ${email} exists`);
    const user = await this.prisma.user.findFirst({
      where: { 
        email,
        deletedAt: null,
      },
    });

    this.logger.debug(`Email ${email} exists: ${!!user}`);
    return !!user;
  }
}
