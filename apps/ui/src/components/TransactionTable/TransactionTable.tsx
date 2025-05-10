import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { 
  Card, 
  Table, 
  TableCell, 
  TableHead, 
  TableRow, 
  TableBody, 
  TablePagination, 
  TableFooter, 
  Typography,
} from "@mui/material";
import { TransactionTableRow } from "./TransactionTableRow";

export type TransactionTableColumn = "date" | "account" | "amount" | "merchant" | "actions";

interface Props {
  transactions: AccountTransactionEntity[];
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  totalRecords: number;
  loading: boolean;
  showColumns?: TransactionTableColumn[];
}

export function TransactionTable({ 
  transactions,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalRecords,
  loading,
  showColumns,
}: Props) {
  const defaultShowColumns: TransactionTableColumn[] = ["date", "account", "amount", "merchant", "actions"];
  const cols = showColumns ?? defaultShowColumns;

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            {cols.includes("date") && <TableCell>Date</TableCell>}
            {cols.includes("account") && <TableCell>Account</TableCell>}
            {cols.includes("amount") && <TableCell>Amount</TableCell>}
            {cols.includes("merchant") && <TableCell>Merchant</TableCell>}
            {cols.includes("actions") && <TableCell></TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((transaction) => (
            <TransactionTableRow key={transaction.id} transaction={transaction} showColumns={cols} />
          ))}
          {!loading && transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body1">No transactions found</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={totalRecords}
              page={currentPage - 1}
              onPageChange={(_, page) => onPageChange(page + 1)}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[10, 25, 50]}
              onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex flex-row justify-end">
      </div>
    </Card>
  )
}
