import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  Session,
  UseGuards,
  Controller,
  // UseInterceptors,
  NotFoundException,
} from '@nestjs/common';

import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';

// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  SetColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  // @Get('/whoami')
  // whoAmiI(@Session() Session: any) {
  //   return this.usersService.findOne(Session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmiI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() Session: any) {
    Session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
