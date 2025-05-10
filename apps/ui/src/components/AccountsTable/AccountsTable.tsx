import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  Card, 
  TableBody, 
} from "@mui/material";
import { AccountTableRow } from "./Row";

interface Props {
  connectedAccounts: ConnectedAccountEntity[];
  onAccountUpdate: (account: ConnectedAccountEntity) => void;
}

export const AccountsTable = ({ 
  connectedAccounts,
  onAccountUpdate,
}: Props) => {
  return (
    <Card >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {connectedAccounts.map((account) => (
            <AccountTableRow
              key={account.id}
              connectedAccount={account}
              onUpdate={onAccountUpdate}
            />
          ))}
        </TableBody>
        {connectedAccounts.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>No accounts found</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </Card>
  );
};
