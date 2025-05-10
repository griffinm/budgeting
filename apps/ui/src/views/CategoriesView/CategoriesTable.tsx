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
            padding: 1,
            borderColor: category.color,
            borderWidth: 4,
            borderStyle: 'solid',
            backgroundColor: isSelected(category) ? category.color : 'background.paper',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: lightGrey,
            },
            transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
            <Typography variant="h6">{category.name}</Typography>
          </div>
        </Paper>
      ))}
    </div>
  )
}
