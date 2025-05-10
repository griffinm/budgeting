import { PickType } from "@nestjs/mapped-types";
import { MerchantEntity } from "./merchant.entity";

export class UpdateMerchantDto extends PickType(
  MerchantEntity,
  [
    'merchantName',
    'plaidEntityId',
    'merchantCategoryId',
    'friendlyName',
    'merchantCategoryId',
  ],
) {}
