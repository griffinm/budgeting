import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MerchantCategoryEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
