import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { fetchConnectedAccounts } from "@budgeting/ui/utils/api";
import { MenuItem, Select, FormControlLabel, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  onChange: (accountId: string) => void;
  selectedAccountId: string;
}

export function AccountSelect({ onChange, selectedAccountId }: Props) {
  const [accounts, setAccounts] = useState<ConnectedAccountEntity[]>([]);

  useEffect(() => {
    fetchConnectedAccounts().then((resp) => {
      setAccounts(resp.data);
    })
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="account-select-label">Filter by Account</InputLabel>
      <Select
        labelId="account-select-label"
        id="account-select"
        value={selectedAccountId}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="" selected>All</MenuItem>
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>{account.nickname || account.plaidName}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
