import { PickType } from "@nestjs/mapped-types";
import { ConnectedAccountEntity } from "./connected-account.entity";

export class UpdateConnectedAccountDto extends PickType(ConnectedAccountEntity, ['nickname']) {}
