import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { fetchMerchant, updateMerchant } from "@budgeting/ui/utils/api";
import { Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { MerchantTransactions } from "./MerchantTransactions";
import { MerchantTotals } from "./MerchantTotals";
import { EditableMerchantCategory } from "@budgeting/ui/components/EditableMerchantCategory";
import { EditableLabel } from "@budgeting/ui/components/EditableLabel/EditableLabel";

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

  const handleMerchantCategoryUpdated = (newCategoryId: string) => {
    updateMerchant({
      id: merchantId,
      updateMerchantDto: {
        merchantCategoryId: newCategoryId,
      },
    }).then((resp) => {
      setMerchant(resp.data);
    });
  }

  return (
    <div>
      <div className="mb-5">
        <EditableLabel
          value={merchant?.friendlyName || merchant?.merchantName}
          labelTypographyProps={{ variant: "h4" }}
          onSave={(newFriendlyName) => {
            updateMerchant({
              id: merchantId,
              updateMerchantDto: {
                friendlyName: newFriendlyName,
              },
            }).then((resp) => {
              setMerchant(resp.data);
            });
          }}
        />
      </div>

      <div className="mb-5">
        <EditableMerchantCategory
          merchant={merchant}
          onCategoryUpdated={handleMerchantCategoryUpdated}
          merchantCategory={merchant?.merchantCategory}
        />
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
