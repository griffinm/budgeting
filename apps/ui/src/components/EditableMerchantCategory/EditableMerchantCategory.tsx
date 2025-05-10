import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { useEffect, useState } from "react";
import { MerchantCategoryEntity } from "@budgeting/api/merchant-category/dto/merchant-category.entity";
import { Check, Cancel } from "@mui/icons-material";
import { IconButton, TextField, Autocomplete, CircularProgress } from "@mui/material";
import { createMerchantCategory, fetchCategories } from "@budgeting/ui/utils/api";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions<Partial<MerchantCategoryEntity>>();
const newNamePrefix = "Create:";

interface EditableMerchantCategoryProps {
  merchant: MerchantEntity | null;
  onCategoryUpdated: (newCategoryId: string) => void;
  merchantCategory?: MerchantCategoryEntity;
}

export function EditableMerchantCategory({
  merchant,
  onCategoryUpdated,
  merchantCategory,
}: EditableMerchantCategoryProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!merchant) {
    return <div className="text-gray-500">Loading merchant data...</div>;
  }

  const handleCategoryUpdated = (newCategoryId: string) => {
    onCategoryUpdated(newCategoryId);
    setIsEditing(false);
  }

  if (isEditing) {
    return <MerchantCategoryEditor
      merchantCategory={merchantCategory}
      onCategoryUpdated={handleCategoryUpdated}
      onCancel={() => setIsEditing(false)}
    />
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer h-5" onClick={() => setIsEditing(true)}>
      {merchantCategory?.name ? (
        <div className="px-3 py-1 rounded-full" style={{ backgroundColor: merchantCategory.color }}>
          {merchantCategory.name}
        </div>
      ) : (
        <div className="text-gray-500 hover:bg-gray-100 rounded-md p-1 transition-colors">Not Categorized</div>
      )}
    </div>
  )
}

function MerchantCategoryEditor({
  merchantCategory,
  onCategoryUpdated,
  onCancel,
}: {
  merchantCategory?: MerchantCategoryEntity;
  onCategoryUpdated: (newCategoryId: string) => void;
  onCancel: () => void;
}) {
  const [categories, setCategories] = useState<MerchantCategoryEntity[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Partial<MerchantCategoryEntity> | null>(null);

  useEffect(() => {
    setCategoriesLoading(true);
    fetchCategories()
      .then(resp => setCategories(resp.data))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const saveCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    if (!selectedCategory.id && selectedCategory.name) {
      // This is a new category
      const newName = selectedCategory.name.startsWith(newNamePrefix) ? selectedCategory.name.slice(newNamePrefix.length).trim() : selectedCategory.name;
      try {
        const createResponse = await createMerchantCategory({
          name: newName,
        });
        // Instead of just updating the state, immediately pass the new ID
        // to onCategoryUpdated so it gets assigned to the merchant
        onCategoryUpdated(createResponse.data.id);
        return; // Exit early since we've already called onCategoryUpdated
      } catch (error) {
        console.error("Failed to create category:", error);
        return;
      }
    }

    if (selectedCategory.id) {
      onCategoryUpdated(selectedCategory.id);
    }
  }

  if (categoriesLoading) {
    return <CircularProgress size={20} />
  }

  return (
    <div className="flex flex-row gap-2">
      <div className="flex-1">
        <Autocomplete<Partial<MerchantCategoryEntity>>
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={categories}
          value={merchantCategory}
          getOptionLabel={(option) => option.name ?? ""}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <div className="flex items-center gap-2" >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }} />
                {option.name}
              </div>
            </li>
          )}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            const isExisting = options.some(option => inputValue === option.name);

            if (inputValue !== '' && !isExisting) {
              filtered.push({
                name: `${newNamePrefix} ${inputValue}`,
              });
            }

            return filtered;
        
          }}
          onChange={(_, value) => {
            if (value) {
              setSelectedCategory(value);
              saveCategory();
            }
          }}
          renderInput={(params) =>
            <TextField 
              {...params} 
              label="Category" 
              size="small"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  saveCategory();
                }
              }}
            />
          }
        />
      </div>
      <IconButton onClick={onCancel} title="Cancel">
        <Cancel />
      </IconButton>
      <IconButton onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        saveCategory();
      }} title="Save">
        <Check />
      </IconButton>
    </div>
  )
}
