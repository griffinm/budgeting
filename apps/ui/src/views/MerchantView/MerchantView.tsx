import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { fetchMerchant, updateMerchant, searchMerchants, fetchMerchants } from "@budgeting/ui/utils/api";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { MerchantTransactions } from "./MerchantTransactions";
import { MerchantTotals } from "./MerchantTotals";
import { EditableMerchantCategory } from "@budgeting/ui/components/EditableMerchantCategory";
import { EditableLabel } from "@budgeting/ui/components/EditableLabel/EditableLabel";
import { MerchantsTable } from "@budgeting/ui/components/MerchantsTable/MerchantsTable";

export function MerchantView({
  merchantId,
}: {
  merchantId: string;
}) {
  const [merchant, setMerchant] = useState<MerchantEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedMerchants, setRelatedMerchants] = useState<MerchantEntity[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchMerchant(merchantId).then((resp) => {
      setMerchant(resp.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [merchantId]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setRelatedMerchants([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetchMerchants({ 
        page: 1, 
        pageSize: 10,
        search: query 
      });
      setRelatedMerchants(response.data);
    } catch (error) {
      console.error("Error searching merchants:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleMerchantCategoryUpdated = (newCategoryId: string) => {
    updateMerchant({
      id: merchantId,
      updateMerchantDto: {
        merchantCategoryId: newCategoryId,
      },
    }).then((resp) => {
      setMerchant(resp.data);
    });
  }

  const handleRelatedMerchantCategoryUpdate = (relatedMerchantId: string, newCategoryId: string) => {
    updateMerchant({
      id: relatedMerchantId,
      updateMerchantDto: {
        merchantCategoryId: newCategoryId,
      },
    }).then(() => {
      // Refresh the related merchants after update
      if (relatedMerchants.length > 0 && relatedMerchants[0].merchantName) {
        handleSearch(relatedMerchants[0].merchantName);
      } else {
        handleSearch("");
      }
    });
  }

  const handleRelatedMerchantNicknameUpdate = (relatedMerchantId: string, newFriendlyName: string) => {
    updateMerchant({
      id: relatedMerchantId,
      updateMerchantDto: {
        friendlyName: newFriendlyName,
      },
    }).then(() => {
      // Refresh the related merchants after update
      if (relatedMerchants.length > 0 && relatedMerchants[0].merchantName) {
        handleSearch(relatedMerchants[0].merchantName);
      } else {
        handleSearch("");
      }
    });
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="mb-5">
        <EditableLabel
          value={merchant?.friendlyName || merchant?.merchantName}
          labelTypographyProps={{ variant: "h4" }}
          onSave={(newFriendlyName) => {
            updateMerchant({
              id: merchantId,
              updateMerchantDto: {
                friendlyName: newFriendlyName,
              },
            }).then((resp) => {
              setMerchant(resp.data);
            });
          }}
        />
      </div>

      <div className="mb-5">
        <EditableMerchantCategory
          merchant={merchant}
          onCategoryUpdated={handleMerchantCategoryUpdated}
          merchantCategory={merchant?.merchantCategory}
        />
      </div>

      <div className="mb-10">
        <div className="mb-2">
          <Typography variant="h5">Spend Summary</Typography>
        </div>
        <MerchantTotals merchantId={merchantId} />
      </div>

      <div className="mb-10">
        <div className="mb-2">
          <Typography variant="h5">Transactions</Typography>
        </div>
        <MerchantTransactions
          merchantId={merchantId}
        />
      </div>

      <div className="mb-10">
        <div className="mb-2">
          <Typography variant="h5">Similar Merchants</Typography>
        </div>
        <Box sx={{ mt: 2 }}>
          <MerchantsTable
            merchants={relatedMerchants}
            onMerchantCategoryUpdate={handleRelatedMerchantCategoryUpdate}
            onMerchantNicknameUpdate={handleRelatedMerchantNicknameUpdate}
            onSearch={handleSearch}
            isLoading={isSearching}
          />
        </Box>
      </div>
    </div>
  )
}
