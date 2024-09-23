import { useEffect, useState } from "react";
import { fetchConnectedAccounts } from "@budgeting/ui/utils/api/connectedAccountClient";
import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { AccountsTable } from "@budgeting/ui/components/AccountsTable";
import { Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { createLinkToken } from "@budgeting/ui/utils/api/authClient";
import { PlaidLink } from "@budgeting/ui/components/PlaidLink";
import { 
  exchangeTokenAndCreateAccounts as exchangeTokenAndCreateAccountsApi
} from "@budgeting/ui/utils/api/connectedAccountClient";
import { useUser } from "@budgeting/ui/providers";

export function AccountsView() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    fetchConnectedAccounts()
      .then((resp) => setConnectedAccounts(resp.data))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleAddAccount = () => {
    if (!user) {
      return;
    }

    createLinkToken({ userId: user.id })
      .then((resp) => {
        setLinkToken(resp.data.linkToken);
      })
      .catch((err) => console.error(err));
  };

  const handleGetPublicToken = (publicToken: string) => {
    exchangeTokenAndCreateAccountsApi(publicToken)
      .then((resp) => {
        setConnectedAccounts([...connectedAccounts, ...resp.data]);
        setLinkToken(undefined);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      {linkToken && <PlaidLink token={linkToken} onGetPublicToken={handleGetPublicToken} />}
      <div className="flex flex-row justify-between pb-7">
        <Typography variant="h4">My Accounts</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddAccount}
        >
          Add Account
        </Button>
      </div>

      <AccountsTable connectedAccounts={connectedAccounts} />
    </div>
  )
}
