import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Popover,
  TextField,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  fetchCategoryById as apiFetchCategoryById,
  fetchCategoriesByAccount as apiFetchCategoriesByAccount,
  createMerchantCategory as apiCreateMerchantCategory,
  MerchantCategoryEntity,
} from '../../utils/api/merchantCategoryClient';
import { updateMerchantCategory as apiUpdateMerchantCategory } from '../../utils/api/merchantClient';

interface EditableMerchantCategoryProps {
  merchantId: string;
  initialCategoryId: string | null;
  accountId: string;
  onCategoryUpdated: (newCategoryId: string | null) => void;
}

export function EditableMerchantCategory({
  merchantId,
  initialCategoryId,
  accountId,
  onCategoryUpdated,
}: EditableMerchantCategoryProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Uncategorized');
  const [isLoadingName, setIsLoadingName] = useState<boolean>(false);
  const [availableCategories, setAvailableCategories] = useState<MerchantCategoryEntity[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAndSetCategoryName = useCallback((categoryId: string | null) => {
    if (!categoryId) {
      setCurrentCategoryName('Uncategorized');
      return;
    }
    setIsLoadingName(true);
    apiFetchCategoryById(categoryId, accountId)
      .then(response => {
        setCurrentCategoryName(response.data?.name || 'Uncategorized');
      })
      .catch(error => {
        console.error('Failed to fetch category name:', error);
        setCurrentCategoryName('Error');
      })
      .finally(() => {
        setIsLoadingName(false);
      });
  }, [accountId]);

  useEffect(() => {
    fetchAndSetCategoryName(initialCategoryId);
  }, [initialCategoryId, fetchAndSetCategoryName]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsLoadingCategories(true);
    apiFetchCategoriesByAccount(accountId)
      .then(response => {
        setAvailableCategories(response.data || []);
      })
      .catch(error => {
        console.error('Failed to fetch available categories:', error);
        setAvailableCategories([]);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setInputValue('');
  };

  const handleCategoryChange = (event: any, newValue: string | MerchantCategoryEntity | null) => {
    handleClosePopover();
    setIsSubmitting(true);

    let categoryPromise: Promise<MerchantCategoryEntity | null>;

    if (typeof newValue === 'string') {
      const potentialNewName = newValue.startsWith('Add "') && newValue.endsWith('"')
        ? newValue.substring(5, newValue.length - 1)
        : newValue;
      const existing = availableCategories.find(c => c.name.toLowerCase() === potentialNewName.toLowerCase());
      if (existing) {
        categoryPromise = Promise.resolve(existing);
      } else {
        categoryPromise = apiCreateMerchantCategory(potentialNewName, accountId)
          .then(response => {
            const newCat = response.data;
            setAvailableCategories(prev => [...prev, newCat]);
            return newCat;
          });
      }
    } else if (newValue?.id) {
      categoryPromise = Promise.resolve(newValue);
    } else {
      categoryPromise = Promise.resolve(null);
    }

    categoryPromise
      .then(resolvedCategoryData => {
        const categoryIdToUpdate = resolvedCategoryData?.id || null;
        return apiUpdateMerchantCategory(merchantId, categoryIdToUpdate)
          .then(() => {
            return resolvedCategoryData;
          });
      })
      .then(resolvedCategoryDataAfterUpdate => {
        const finalCategoryId = resolvedCategoryDataAfterUpdate?.id || null;
        const finalCategoryName = resolvedCategoryDataAfterUpdate?.name || 'Uncategorized';

        setCurrentCategoryName(finalCategoryName);
        onCategoryUpdated(finalCategoryId);
      })
      .catch(error => {
        console.error('Failed to update or create category:', error);
        fetchAndSetCategoryName(initialCategoryId);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const open = Boolean(anchorEl);
  const id = open ? `category-popover-${merchantId}` : undefined;

  return (
    <>
      <Box onClick={handleOpenPopover} sx={{ cursor: 'pointer', minWidth: 100, display: 'inline-block' }}>
        {isLoadingName || isSubmitting ? <CircularProgress size={20} /> : <Typography variant="body2">{currentCategoryName}</Typography>}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          {isLoadingCategories ? (
            <CircularProgress />
          ) : (
            <Autocomplete<MerchantCategoryEntity | string, false, boolean, true>
              fullWidth
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={availableCategories}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.name;
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              onChange={handleCategoryChange}
              renderOption={(props, option) => {
                const key = typeof option === 'string' ? option : option.id;
                const name = typeof option === 'string' ? option : option.name;
                return (
                  <li {...props} key={key}>
                    {name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search or Create Category"
                  variant="standard"
                  autoFocus
                />
              )}
              filterOptions={(options, params) => {
                const filtered = options.filter(option => {
                  if (typeof option === 'string') {
                    return option.toLowerCase().includes(params.inputValue.toLowerCase());
                  }
                  return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                });
                const isExisting = availableCategories.some(
                  option => option.name.toLowerCase() === params.inputValue.toLowerCase()
                );
                if (params.inputValue !== '' && !isExisting) {
                  filtered.push({
                    id: `add-${params.inputValue}`,
                    name: `Add "${params.inputValue}"`,
                    accountId: accountId,
                  } as MerchantCategoryEntity);
                }
                return filtered;
              }}
            />
          )}
          <Button onClick={handleClosePopover} sx={{ mt: 1 }}>Cancel</Button>
        </Box>
      </Popover>
    </>
  );
} 