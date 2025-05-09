import React from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Tabs, Tab } from '@mui/material';
import { CategoryDetail } from './CategoryDetail';
import { CategoryChart } from './CategoryChart';
import { MonthDataDto } from "@budgeting/api/Spend/dto/spend-summary.dto";

interface MonthlyBreakdownProps {
  monthlyData: Array<{
    month: string;
    amount: number;
    categories: MonthDataDto['categories'];
    totalAmount: string;
  }>;
}

export function MonthlyBreakdown({ monthlyData }: MonthlyBreakdownProps) {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Card>
      <CardHeader title="Monthly Breakdown" />
      <CardContent>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {monthlyData.map((monthData, index) => (
            <Tab 
              key={monthData.month} 
              label={new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
        
        {monthlyData.map((monthData, index) => (
          <Box
            key={monthData.month}
            role="tabpanel"
            hidden={selectedTab !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
          >
            {selectedTab === index && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">
                  Total for {new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}:
                  ${parseFloat(monthData.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>

                {/* Category breakdown chart for the current month */}
                <CategoryChart categories={monthData.categories} />

                {/* Category breakdown for the month */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {monthData.categories.map((category) => (
                    <CategoryDetail 
                      key={category.categoryId}
                      category={category}
                      monthTotalAmount={monthData.totalAmount}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
} 
