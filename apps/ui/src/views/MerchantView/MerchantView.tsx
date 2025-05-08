import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { fetchMerchant } from "@budgeting/ui/utils/api";
import { Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { MerchantTransactions } from "./MerchantTransactions";
import { MerchantTotals } from "./MerchantTotals";

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

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="mb-5">
        <Typography variant="h4">{merchant?.merchantName}</Typography>
      </div>

      <div className="mb-10">
        <div className="mb-2">
          <Typography variant="h5">Spend Summary</Typography>
        </div>
        <MerchantTotals merchantId={merchantId} />
      </div>

      <div className="mb-10">
        <div className="mb-2">
          <Typography variant="h5">Transactions</Typography>
        </div>
        <MerchantTransactions
          merchantId={merchantId}
        />
      </div>
    </div>
  )
}
