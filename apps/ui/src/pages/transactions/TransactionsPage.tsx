import { Helmet } from "react-helmet";
import { TransactionsView } from "@budgeting/ui/views";

export function TransactionsPage() {

  return (
    <>
      <Helmet>
        <title>Transactions | Budgeting</title>
      </Helmet>
      
      <TransactionsView />
    </>
  )
}
