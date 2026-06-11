export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
