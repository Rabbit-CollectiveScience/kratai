"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
class CreateUserDto {
    name;
    email;
    password;
}
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto {
    name;
    email;
}
exports.UpdateUserDto = UpdateUserDto;
class UserResponseDto {
    id;
    name;
    email;
    createdAt;
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=user.dto.js.map