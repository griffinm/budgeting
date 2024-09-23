import { Helmet } from "react-helmet";
import { AccountsView } from "@budgeting/ui/views";

export function AccountsPage() {
  return (
    <>
      <Helmet>
        <title>Accounts | Budgeting</title>
      </Helmet>
      
      <AccountsView />
    </>
  )
}
