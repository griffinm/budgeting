import { PickType } from "@nestjs/mapped-types";
import { UserEntity } from "../entities/user.entity";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateUserDto extends PickType(
  UserEntity, 
  [
    'email',
    'name',
  ]
) {
  @IsString()
  @IsNotEmpty()
  password: string;
}
