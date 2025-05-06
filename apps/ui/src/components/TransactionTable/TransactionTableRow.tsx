import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { TableRow, TableCell, Chip, Link } from "@mui/material";
import { format as formatDate } from "date-fns";
import { getMerchantName } from "./utils";
import { MerchantLogo } from "../MerchantLogo/MerchantLogo";
import { urls } from "@budgeting/ui/utils/urls";
import { Link as RouterLink } from "react-router-dom";
import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { TransactionTableColumn } from "./TransactionTable";
interface Props {
  transaction: AccountTransactionEntity;
  showColumns: TransactionTableColumn[];
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

export function TransactionTableRow({ transaction, showColumns }: Props) {
  return (
    <TableRow>
      {showColumns.includes("date") && (
        <TableCell>
          {formatDate(transaction.date, "M/d/yy")}
        </TableCell>
      )}
      {showColumns.includes("account") && (
        <TableCell>
        <Chip
          label={
            `${transaction.connectedAccount.nickname || transaction.connectedAccount.plaidOfficialName} - ${transaction.connectedAccount.plaidMask}`
          }
          variant="outlined"
          />
        </TableCell>
      )}
      {showColumns.includes("amount") && (
        <TableCell>
          {formatAmount(transaction.amount)}
        </TableCell>
      )}
      {showColumns.includes("merchant") && (
        <TableCell>
          <MerchantLink merchant={transaction.merchant}>
          <div className="flex items-center gap-2">
              <MerchantLogo merchant={transaction.merchant} fallbackText={getMerchantName(transaction)} />
              <div className="flex flex-col">
                {getMerchantName(transaction)}
              </div>
            </div>
          </MerchantLink>
        </TableCell>
      )}
      {showColumns.includes("actions") && (
        <TableCell></TableCell>
      )}
    </TableRow>
  )
}

function MerchantLink({ merchant, children }: { merchant?: MerchantEntity, children: React.ReactNode }) {
  if (!merchant) {
    return children;
  }

  return (
    <RouterLink to={urls.merchant(merchant.id)}>
      {children}
    </RouterLink>
  )
}