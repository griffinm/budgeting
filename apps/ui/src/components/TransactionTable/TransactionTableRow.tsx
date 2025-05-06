import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { TableRow, TableCell, Chip } from "@mui/material";
import { format as formatDate } from "date-fns";
import { getMerchantName } from "./utils";
import { MerchantLogo } from "../MerchantLogo/MerchantLogo";

interface Props {
  transaction: AccountTransactionEntity;
}

const formatAmount = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    return amount;
  }

  if (parsedAmount > 0) {
    return (
      <span className="font-semibold text-zinc-500">
        {`$${Math.abs(parsedAmount).toFixed(2)}`}
      </span>
    )
  }

  return (
    <span className="font-semibold text-green-600">
      {`$${Math.abs(parsedAmount).toFixed(2)}`}
    </span>
  )
}

export function TransactionTableRow({ transaction }: Props) {
  return (
    <TableRow>
      <TableCell>
        {formatDate(transaction.date, "M/d/yy")}
      </TableCell>
      <TableCell>
        <Chip
          label={
            `${transaction.connectedAccount.nickname || transaction.connectedAccount.plaidOfficialName} - ${transaction.connectedAccount.plaidMask}`
          }
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        {formatAmount(transaction.amount)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <MerchantLogo merchant={transaction.merchant} fallbackText={getMerchantName(transaction)} />
          <div className="flex flex-col">
            {getMerchantName(transaction)}
          </div>
        </div>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  )
}
