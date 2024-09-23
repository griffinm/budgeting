import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  Card, 
  TableBody, 
  Typography
} from "@mui/material";
import { format as formatDate } from "date-fns";
interface Props {
  connectedAccounts: ConnectedAccountEntity[];
}

export const AccountsTable = ({ 
  connectedAccounts,
}: Props) => {
  return (
    <>
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
              <TableRow key={account.id}>
                <TableCell>
                  <div className="flex flex-col">
                    {account.plaidOfficialName}
                    <Typography variant="caption">
                      {account.plaidSubtype}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  ****{account.plaidMask}
                </TableCell>
                <TableCell>
                  {formatDate(new Date(account.updatedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  $0.00
                </TableCell>
              </TableRow>
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
    </>
  );
};
