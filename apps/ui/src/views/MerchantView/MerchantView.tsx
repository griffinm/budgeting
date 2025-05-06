import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { fetchMerchant } from "@budgeting/ui/utils/api";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { MerchantTransactions } from "./MerchantTransactions";

export function MerchantView({
  merchantId,
}: {
  merchantId: string;
}) {
  const [merchant, setMerchant] = useState<MerchantEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    fetchMerchant(merchantId).then((resp) => {
      setMerchant(resp.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [merchantId]);

  return (
    <div>
      <div className="mb-5">
        <Typography variant="h4">{merchant?.merchantName}</Typography>
      </div>

      <Typography variant="h5">Transactions</Typography>
      <MerchantTransactions
        merchantId={merchantId}
      />
    </div>
  )
}