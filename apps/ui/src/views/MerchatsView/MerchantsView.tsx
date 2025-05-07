import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { MerchantsTable } from "@budgeting/ui/components/MerchantsTable/MerchantsTable";
import { fetchMerchants } from "@budgeting/ui/utils/api/merchantClient";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function MerchantsView() {
  const [merchants, setMerchants] = useState<MerchantEntity[]>([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  useEffect(() => {
    setMerchantsLoading(true);
    fetchMerchants({
      page: 1,
      pageSize: 10,
    }).then((res) => {
      setMerchants(res.data);
    })
    .finally(() => {
      setMerchantsLoading(false);
    });
  }, []);
  
  return (
    <div>
      <div className="mb-5">
        <Typography variant="h3">Merchants</Typography>
      </div>

      <MerchantsTable merchants={merchants} />
    </div>
  )
}