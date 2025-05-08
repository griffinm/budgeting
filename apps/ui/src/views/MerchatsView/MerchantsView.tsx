import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { MerchantsTable } from "@budgeting/ui/components/MerchantsTable/MerchantsTable";
import { fetchMerchants, updateMerchant } from "@budgeting/ui/utils/api/merchantClient";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function MerchantsView() {
  const [merchants, setMerchants] = useState<MerchantEntity[]>([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  useEffect(() => {
    setMerchantsLoading(true);
    fetchMerchants({
      page: 1,
      pageSize: 25,
    }).then((res) => {
      setMerchants(res.data);
    })
    .finally(() => {
      setMerchantsLoading(false);
    });
  }, []);

  const handleMerchantCategoryUpdated = async (merchantId: string, newCategoryId: string) => {
    const response = await updateMerchant({
      id: merchantId,
      updateMerchantDto: {
        merchantCategoryId: newCategoryId,
      },
    });

    updateMerchantList(response.data);
  };  
  
  const handleMerchantFriendlyNameUpdated = async (merchantId: string, newFriendlyName: string) => {
    const response = await updateMerchant({
      id: merchantId,
      updateMerchantDto: {
        friendlyName: newFriendlyName,
      },
    });

    updateMerchantList(response.data);
  };

  const updateMerchantList = (merchant: MerchantEntity) => {
    setMerchants(merchants.map((m) => {
      if (m.id === merchant.id) {
        return merchant;
      }
      return m;
    }));
  }
  return (
    <div>
      <div className="mb-5">
        <Typography variant="h3">Merchants</Typography>
      </div>
      {merchantsLoading ? (
        <CircularProgress />
      ) : (
        <MerchantsTable
          merchants={merchants}
          onMerchantCategoryUpdate={handleMerchantCategoryUpdated}
          onMerchantNicknameUpdate={handleMerchantFriendlyNameUpdated}
        />
      )}
    </div>
  )
}
