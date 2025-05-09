import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Grid,
  Box
} from '@mui/material';

// Generate year options from 2020 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

// Month options
const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

interface DateRangeFilterProps {
  startYear: number;
  startMonth: string;
  endYear: number;
  endMonth: string;
  onStartYearChange: (event: SelectChangeEvent<number>) => void;
  onStartMonthChange: (event: SelectChangeEvent) => void;
  onEndYearChange: (event: SelectChangeEvent<number>) => void;
  onEndMonthChange: (event: SelectChangeEvent) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

export function DateRangeFilter({
  startYear,
  startMonth,
  endYear,
  endMonth,
  onStartYearChange,
  onStartMonthChange,
  onEndYearChange,
  onEndMonthChange,
  onApplyFilter,
  onClearFilter
}: DateRangeFilterProps) {
  return (
    <Card>
      <CardHeader title="Date Range" />
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="start-year-label">Start Year</InputLabel>
              <Select
                labelId="start-year-label"
                value={startYear}
                label="Start Year"
                onChange={onStartYearChange}
              >
                {years.map(year => (
                  <MenuItem key={`start-year-${year}`} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="start-month-label">Start Month</InputLabel>
              <Select
                labelId="start-month-label"
                value={startMonth}
                label="Start Month"
                onChange={onStartMonthChange}
              >
                {months.map(month => (
                  <MenuItem key={`start-month-${month.value}`} value={month.value}>{month.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="end-year-label">End Year</InputLabel>
              <Select
                labelId="end-year-label"
                value={endYear}
                label="End Year"
                onChange={onEndYearChange}
              >
                {years.map(year => (
                  <MenuItem key={`end-year-${year}`} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="end-month-label">End Month</InputLabel>
              <Select
                labelId="end-month-label"
                value={endMonth}
                label="End Month"
                onChange={onEndMonthChange}
              >
                {months.map(month => (
                  <MenuItem key={`end-month-${month.value}`} value={month.value}>{month.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={onApplyFilter}
              >
                Apply
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                size="small"
                onClick={onClearFilter}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 
