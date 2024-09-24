import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { Card, Table, TableCell, TableHead, TableRow, TableBody, TablePagination, TableFooter } from "@mui/material";
import { format as formatDate } from "date-fns";

interface Props {
  transactions: AccountTransactionEntity[];
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  totalRecords: number;
}

export function TransactionTable({ 
  transactions,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalRecords,
}: Props) {

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Merchant</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.date, "M/dd/yyyy")}</TableCell>
              <TableCell>
                ${parseFloat(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>{transaction.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
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
