import { getTransactionTotal } from "@budgeting/ui/utils/api";
import { formatCurrency } from "@budgeting/ui/utils/formatters";
import { Card, CardContent, CardHeader, CircularProgress, Typography } from "@mui/material";
import { subDays } from "date-fns";
import { useState, useEffect } from "react";

export function MerchantTotals({
  merchantId,
}: {
  merchantId: string;
}) {

  
  return (
    <div className="grid grid-cols-4 gap-4">
      <MerchantTotalsCard merchantId={merchantId} days={30} label="Last Month" />
      <MerchantTotalsCard merchantId={merchantId} days={90} label="Last 3 Months" />
      <MerchantTotalsCard merchantId={merchantId} days={365} label="Last Year" />
      <MerchantTotalsCard merchantId={merchantId} days={99999} label="All Time" />
    </div>
  )
}

export function MerchantTotalsCard({
  merchantId,
  days,
  label,
}: {
  merchantId: string;
  days: number;
  label: string;
}) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    getTransactionTotal({
      filter: {
        merchantId,
        startDate: subDays(new Date(), days),
        endDate: new Date(),
      },
    }).then((resp) => {
      setTotal(resp.data);
    }).finally(() => {
      setLoading(false);
    });
  }, [merchantId, days]);

  return (
    <Card>
      <CardHeader title={label} />
      <CardContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="h4">{formatCurrency(total)}</Typography>
        )}

      </CardContent>
    </Card>
  )
}