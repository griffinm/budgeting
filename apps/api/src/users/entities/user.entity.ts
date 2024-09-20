import { 
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from "class-validator";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
  
  @Expose()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsDate()
  @IsOptional()
  deletedAt: Date;
}
