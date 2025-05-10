import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";

export function merchantName({
  merchant,
}: {
  merchant: MerchantEntity;
}) {
  if (!merchant) {
    return '';
  }

  return merchant.friendlyName || merchant.merchantName || merchant.id;
}