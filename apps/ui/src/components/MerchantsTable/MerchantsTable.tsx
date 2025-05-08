import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { merchantName } from "@budgeting/ui/utils/merchantName";
import { urls } from "@budgeting/ui/utils/urls";
import { EditableMerchantCategory } from "./EditableMerchantCategory";
import { EditableLabel } from "../EditableLabel/EditableLabel";

export interface MerchantsTableProps {
  merchants: MerchantEntity[];
  onMerchantCategoryUpdate: (merchantId: string, newCategoryId: string) => void;
  onMerchantNicknameUpdate: (merchantId: string, newFriendlyName: string) => void;
}

export function MerchantsTable({
  merchants,
  onMerchantCategoryUpdate,
  onMerchantNicknameUpdate,
}: MerchantsTableProps) {
  return (
    <Table className="w-full">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Category</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {merchants.map((merchant) => (
          <TableRow key={merchant.id}>
            <TableCell>
              <EditableLabel
                value={merchant.friendlyName || merchant.merchantName}
                onSave={(newFriendlyName) => onMerchantNicknameUpdate(merchant.id, newFriendlyName)}
              />
            </TableCell>
            <TableCell>
              <EditableMerchantCategory
                merchant={merchant}
                onCategoryUpdated={(newCategoryId) => onMerchantCategoryUpdate(merchant.id, newCategoryId)}
                merchantCategory={merchant.merchantCategory}
              />
            </TableCell>
            <TableCell>
              <Link component={RouterLink} to={urls.merchant(merchant.id)}>
                View Details
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
