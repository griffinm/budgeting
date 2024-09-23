import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  Card, 
  TableBody 
} from "@mui/material";

interface Props {
  connectedAccounts: ConnectedAccountEntity[];
}

export const AccountsTable = ({ 
  connectedAccounts,
}: Props) => {
  return (
    <>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {connectedAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
          {connectedAccounts.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={3}>No accounts found</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </Card>
    </>
  );
};
