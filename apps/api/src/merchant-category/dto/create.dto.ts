import { PickType } from '@nestjs/mapped-types';
import { MerchantCategoryEntity } from './merchant-category.entity';

export class CreateMerchantCategoryDto extends PickType(MerchantCategoryEntity, [
  'name',
  'description'
]) {}
