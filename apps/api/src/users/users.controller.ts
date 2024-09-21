import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from "@budgeting/api/auth";
import { SignInResponse } from '@budgeting/types';
import { AuthService } from '@budgeting/api/auth';
import { AuthUser, RequestWithUser } from '@budgeting/types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('current')
  @UseGuards(AuthGuard)
  async current(
    @Req() req: RequestWithUser,
  ): Promise<AuthUser> {
    return {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      accountId: req.user.accountId,
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<SignInResponse> {
    const user = await this.usersService.create(createUserDto);
    return {
      jwt: await this.authService.signJwt(user.id),
      user,
    };
  }

  @Patch(':id')
  // @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
