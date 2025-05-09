import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { Table, TableBody, TableCell, TableHead, TableRow, Link, TextField, Box, CircularProgress } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { urls } from "@budgeting/ui/utils/urls";
import { EditableMerchantCategory } from "@budgeting/ui/components/EditableMerchantCategory";
import { EditableLabel } from "../EditableLabel/EditableLabel";
import { useEffect, useState } from "react";

export interface MerchantsTableProps {
  merchants: MerchantEntity[];
  onMerchantCategoryUpdate: (merchantId: string, newCategoryId: string) => void;
  onMerchantNicknameUpdate: (merchantId: string, newFriendlyName: string) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function MerchantsTable({
  merchants,
  onMerchantCategoryUpdate,
  onMerchantNicknameUpdate,
  onSearch,
  isLoading = false,
}: MerchantsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Debugging: Log when search props change
  useEffect(() => {
    console.log("MerchantsTable received onSearch function", !!onSearch);
  }, [onSearch]);
  
  // Debugging: Log when search query changes
  useEffect(() => {
    console.log("Search query changed:", searchQuery);
  }, [searchQuery]);
  
  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    console.log("Setting up debounce timer for:", searchQuery);
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);
  
  // Trigger search when debounced query changes
  useEffect(() => {
    console.log("Debounced query changed to:", debouncedQuery);
    if (onSearch) {
      console.log("Calling onSearch with:", debouncedQuery);
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  // Handle input change directly
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search input changed to:", value);
    setSearchQuery(value);
  };

  // Add this effect to log when the merchants prop changes
  useEffect(() => {
    console.log("MerchantsTable received merchants:", merchants.length);
  }, [merchants]);

  // Fix: Reset search query when component receives new merchants from parent
  useEffect(() => {
    if (merchants && merchants.length > 0 && debouncedQuery && !isLoading) {
      console.log("Search results received, keeping current search query");
    }
  }, [merchants, debouncedQuery, isLoading]);

  return (
    <div>
      <Box sx={{ mb: 2, position: 'relative' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search merchants..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          size="small"
          InputProps={{
            endAdornment: isLoading && (
              <CircularProgress size={20} color="inherit" />
            ),
          }}
        />
      </Box>
      
      <Table className="w-full">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {merchants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                {isLoading ? "Loading..." : "No merchants found"}
              </TableCell>
            </TableRow>
          ) : (
            merchants.map((merchant) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
