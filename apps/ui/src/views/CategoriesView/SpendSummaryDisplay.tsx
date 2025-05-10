import { useMemo, useState, useEffect } from 'react';
import { SpendSummaryDto } from "@budgeting/api/Spend/dto/spend-summary.dto";
import { Box, Card, CardContent } from "@mui/material";
import { DateRangeFilter } from './components/DateRangeFilter';
import { TotalSummaryCard } from './components/TotalSummaryCard';
import { MonthlyBreakdown } from './components/MonthlyBreakdown';
import { SelectChangeEvent } from "@mui/material";
import { LoadingSpinner } from '@budgeting/ui/components/Loading';

interface SpendSummaryDisplayProps {
  spendSummary: SpendSummaryDto | null;
  loading: boolean;
  onFilterChange: (startDate: string | null, endDate: string | null) => void;
}

export function SpendSummaryDisplay({ spendSummary, loading, onFilterChange }: SpendSummaryDisplayProps) {
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState<string>('01');
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  
  // Initialize with current date range
  useEffect(() => {
    const today = new Date();
    setEndYear(today.getFullYear());
    setEndMonth(String(today.getMonth() + 1).padStart(2, '0'));
    
    // Default start date is 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    setStartYear(sixMonthsAgo.getFullYear());
    setStartMonth(String(sixMonthsAgo.getMonth() + 1).padStart(2, '0'));
    
    // Apply initial filter
    handleApplyFilter();
  }, []);
  
  const monthlyData = useMemo(() => {
    if (!spendSummary) return [];
    
    return Object.entries(spendSummary.months)
      .map(([month, data]) => ({
        month,
        amount: parseFloat(data.totalAmount),
        ...data
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [spendSummary]);
  
  const handleStartYearChange = (event: SelectChangeEvent<number>) => {
    setStartYear(event.target.value as number);
  };
  
  const handleStartMonthChange = (event: SelectChangeEvent) => {
    setStartMonth(event.target.value);
  };
  
  const handleEndYearChange = (event: SelectChangeEvent<number>) => {
    setEndYear(event.target.value as number);
  };
  
  const handleEndMonthChange = (event: SelectChangeEvent) => {
    setEndMonth(event.target.value);
  };
  
  const handleApplyFilter = () => {
    const startDate = `${startYear}-${startMonth}-01`;
    
    // Set end date to last day of the month
    const lastDay = new Date(endYear, parseInt(endMonth), 0).getDate();
    const endDate = `${endYear}-${endMonth}-${lastDay}`;
    
    onFilterChange(startDate, endDate);
  };
  
  const handleClearFilter = () => {
    onFilterChange(null, null);
  };

  if (loading) {
    return (
      <Card sx={{ mt: 3 }}>
        <LoadingSpinner />
      </Card>
    );
  }

  if (!spendSummary) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <DateRangeFilter
        startYear={startYear}
        startMonth={startMonth}
        endYear={endYear}
        endMonth={endMonth}
        onStartYearChange={handleStartYearChange}
        onStartMonthChange={handleStartMonthChange}
        onEndYearChange={handleEndYearChange}
        onEndMonthChange={handleEndMonthChange}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />

      <TotalSummaryCard
        totalAmount={spendSummary.totalAmount}
        monthlyData={monthlyData.map(data => ({
          month: data.month,
          amount: data.amount,
          categories: data.categories.map(cat => ({
            categoryId: cat.categoryId,
            name: cat.categoryName,
            color: cat.categoryColor,
            amount: parseFloat(cat.totalAmount)
          }))
        }))}
      />

      <MonthlyBreakdown monthlyData={monthlyData} />
    </Box>
  );
} 
