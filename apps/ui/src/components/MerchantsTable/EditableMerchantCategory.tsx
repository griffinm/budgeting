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
  fetchCategories as apiFetchCategories,
  createMerchantCategory as apiCreateMerchantCategory,
} from '../../utils/api/merchantCategoryClient';
import { updateMerchantCategory as apiUpdateMerchantCategory } from '../../utils/api/merchantClient';
import { MerchantCategoryEntity } from '@budgeting/api/merchant-categories/dto/merchant-category.entity';

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
    apiFetchCategoryById({ categoryId })
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
  }, []);

  useEffect(() => {
    fetchAndSetCategoryName(initialCategoryId);
  }, [initialCategoryId, fetchAndSetCategoryName]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsLoadingCategories(true);
    apiFetchCategories()
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
    if (!newValue || typeof newValue !== 'string' || newValue === 'add-') {
      return;
    }

    if (newValue.startsWith('add-')) {
      // Create new category
      const newCategoryName = newValue.slice(4);
      apiCreateMerchantCategory({ name: newCategoryName })
        .then(response => {
          console.log('New category created:', response.data);
        })
        .catch(error => console.error('Failed to create new category:', error));
    }

    console.log('handleCategoryChange', newValue);
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
