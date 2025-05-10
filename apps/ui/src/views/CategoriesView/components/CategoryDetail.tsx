import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { CategoryTransactionsDto } from "@budgeting/api/Spend/dto/spend-summary.dto";
import { TransactionsTable } from './TransactionsTable';

interface CategoryDetailProps {
  category: CategoryTransactionsDto;
  monthTotalAmount: string;
}

export function CategoryDetail({ category, monthTotalAmount }: CategoryDetailProps) {
  return (
    <Box 
      sx={{ 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 1,
        p: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography fontWeight="medium">{category.categoryName}</Typography>
        <Typography fontWeight="bold">
          ${parseFloat(category.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate"
        value={parseFloat(category.totalAmount) / parseFloat(monthTotalAmount) * 100}
        sx={{ height: 8, mb: 2 }}
      />
      
      <TransactionsTable transactions={category.transactions} />
    </Box>
  );
} 
