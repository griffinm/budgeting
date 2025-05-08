import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { merchantName } from "@budgeting/ui/utils/merchantName";
import { urls } from "@budgeting/ui/utils/urls";
import { EditableMerchantCategory } from "./EditableMerchantCategory";

export interface MerchantsTableProps {
  merchants: MerchantEntity[];
  onMerchantCategoryUpdate: (merchantId: string, newCategoryId: string) => void;
}

export function MerchantsTable({
  merchants,
  onMerchantCategoryUpdate,
}: MerchantsTableProps) {
  return (
    <Table className="w-full">
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
                merchant={merchant}
                onCategoryUpdated={(newCategoryId) => onMerchantCategoryUpdate(merchant.id, newCategoryId)}
                merchantCategory={merchant.merchantCategory}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
