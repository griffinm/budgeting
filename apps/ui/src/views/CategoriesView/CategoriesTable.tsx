import { MerchantCategoryEntity } from "@budgeting/api/merchant-categories/dto/merchant-category.entity";
import { Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const lightGrey = grey[200];

export function CategoriesTable({ 
  categories,
  onSelectCategory,
  selectedCategories,
}: { 
  categories: MerchantCategoryEntity[],
  onSelectCategory: (category: MerchantCategoryEntity) => void,
  selectedCategories: MerchantCategoryEntity[],
}) {
  const isSelected = (category: MerchantCategoryEntity) => {
    return selectedCategories.includes(category);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Paper
          elevation={2}
          key={category.id} 
          onClick={() => onSelectCategory(category)} 
          sx={{
            padding: 2,
            backgroundColor: isSelected(category) ? 'primary.main' : 'background.paper',
            color: isSelected(category) ? 'primary.contrastText' : 'text.primary',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: lightGrey,
            },
            transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
          <Typography variant="h6">{category.name}</Typography>
        </Paper>
      ))}
    </div>
  )
}
