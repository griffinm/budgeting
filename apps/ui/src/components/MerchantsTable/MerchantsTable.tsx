import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { merchantName } from "@budgeting/ui/utils/merchantName";
import { urls } from "@budgeting/ui/utils/urls";
import { EditableMerchantCategory } from "./EditableMerchantCategory";

export interface MerchantsTableProps {
  merchants: MerchantEntity[];
  accountId: string;
  onMerchantCategoryUpdate?: (merchantId: string, newCategoryId: string | null) => void;
}

export function MerchantsTable({
  merchants,
  accountId,
  onMerchantCategoryUpdate,
}: MerchantsTableProps) {

  const handleCategoryUpdated = (merchantId: string, newCategoryId: string | null) => {
    console.log(`Merchant ${merchantId} category updated to ${newCategoryId}`);
    if (onMerchantCategoryUpdate) {
      onMerchantCategoryUpdate(merchantId, newCategoryId);
    }
  };

  if (!accountId) {
    console.warn("MerchantsTable: accountId prop is missing, EditableMerchantCategory may not work correctly.");
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Statement Name</TableCell>
          <TableCell>Category</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {merchants.map((merchant) => (
          <TableRow key={merchant.id}>
            <TableCell>
              <Link component={RouterLink} to={urls.merchant(merchant.id)}>
                {merchantName({ merchant })}
              </Link>
            </TableCell>
            <TableCell>{merchant.merchantName}</TableCell>
            <TableCell>
              <EditableMerchantCategory
                merchantId={merchant.id}
                initialCategoryId={merchant.merchantCategoryId}
                accountId={accountId}
                onCategoryUpdated={(newCategoryId) => handleCategoryUpdated(merchant.id, newCategoryId)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}