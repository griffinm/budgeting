import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { Exclude, Expose } from "class-transformer";
import { 
  IsDate, 
  IsNotEmpty, 
  IsNumber, 
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

@Exclude()
export class BalanceEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  connectedAccountId: string;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  runningBalance: number;

  @Expose()
  @IsObject()
  @IsOptional()
  connectedAccount?: ConnectedAccountEntity;
}
