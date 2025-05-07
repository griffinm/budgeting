import { Helmet } from "react-helmet";
import { MerchantsView } from "../../views/MerchatsView";

export function MerchantsPage() {
  return (
    <>
      <Helmet>
        <title>Merchants | Budgeting</title>
      </Helmet>
      <MerchantsView />
    </>
  )
}