import { MerchantView } from "@budgeting/ui/views/MerchantView/MerchantView";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

export function MerchantPage() {
  const { merchantId } = useParams();

  if (!merchantId) {
    return <div>Merchant not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>Merchant | Budgeting</title>
      </Helmet>

      <MerchantView merchantId={merchantId} />
    </>
  )
}
