import { PageHeader } from "@budgeting/ui/components/PageHeader";
import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { MerchantsTable } from "@budgeting/ui/components/MerchantsTable/MerchantsTable";
import { fetchMerchants, updateMerchant } from "@budgeting/ui/utils/api/merchantClient";
import { CircularProgress } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";

export function MerchantsView() {
  const [merchants, setMerchants] = useState<MerchantEntity[]>([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const initialLoadDone = useRef(false);

  const loadMerchants = useCallback((search?: string) => {   
    if (search !== undefined) {
      setIsSearching(true);
    } else {
      setMerchantsLoading(true);
    }

    fetchMerchants({
      page: 1,
      pageSize: 25,
      search: search,
    }).then((res) => {
      if (Array.isArray(res.data)) {
        setMerchants(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setMerchants(res.data.data);
      } else {
        console.error("Unexpected response format:", res);
        setMerchants([]);
      }
    })
    .catch(err => {
      setMerchants([]);
    })
    .finally(() => {
      setMerchantsLoading(false);
      setIsSearching(false);
    });
  }, []);

  // Perform initial load only once
  useEffect(() => {
    if (!initialLoadDone.current) {
      loadMerchants();
      initialLoadDone.current = true;
    }
  }, [loadMerchants]);

  // Stable search handler that doesn't trigger rerenders
  const handleSearch = useCallback((query: string) => {
    const searchTerm = query.trim() || undefined;
    loadMerchants(searchTerm);
  }, [loadMerchants]);

  const handleMerchantCategoryUpdated = async (merchantId: string, newCategoryId: string) => {
    const response = await updateMerchant({
      id: merchantId,
      updateMerchantDto: {
        merchantCategoryId: newCategoryId,
      },
    });

    updateMerchantList(response.data);
  };  
  
  const handleMerchantFriendlyNameUpdated = async (merchantId: string, newFriendlyName: string) => {
    const response = await updateMerchant({
      id: merchantId,
      updateMerchantDto: {
        friendlyName: newFriendlyName,
      },
    });

    updateMerchantList(response.data);
  };

  const updateMerchantList = (merchant: MerchantEntity) => {
    setMerchants(merchants.map((m) => {
      if (m.id === merchant.id) {
        return merchant;
      }
      return m;
    }));
  }
  
  return (
    <div>
      <PageHeader title="Merchants" />

      {merchantsLoading && merchants.length === 0 ? (
        <CircularProgress />
      ) : (
        <MerchantsTable
          merchants={merchants}
          onMerchantCategoryUpdate={handleMerchantCategoryUpdated}
          onMerchantNicknameUpdate={handleMerchantFriendlyNameUpdated}
          onSearch={handleSearch}
          isLoading={isSearching}
        />
      )}
    </div>
  )
}
