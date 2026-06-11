import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): UserResponseDto {
    const user = this.usersService.create(createUserDto);
    return this.toResponseDto(user);
  }

  @Get()
  findAll(): UserResponseDto[] {
    const users = this.usersService.findAll();
    return users.map(user => this.toResponseDto(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string): UserResponseDto | null {
    const user = this.usersService.findOne(id);
    return user ? this.toResponseDto(user) : null;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): UserResponseDto | null {
    const user = this.usersService.update(id, updateUserDto);
    return user ? this.toResponseDto(user) : null;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    const success = this.usersService.remove(id);
    return { success };
  }

  private toResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}
