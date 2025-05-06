import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";

export function MerchantLogo({
  merchant,
  fallbackText = "?",
}: {
  merchant?: MerchantEntity;
  fallbackText?: string;
}) {
  const hasLogo = !!merchant?.logoUrl;
  const nameToUse = fallbackText;

  return (
    <div className="flex items-center gap-2">
      {hasLogo ? (
        <img src={merchant?.logoUrl} alt={merchant?.merchantName} className="w-6 h-6 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-green-200">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {nameToUse?.split(' ').slice(0,2).map(word => word.charAt(0).toUpperCase()).join('')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}