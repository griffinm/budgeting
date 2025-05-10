import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box
} from '@mui/material';
import ApexChart from 'react-apexcharts';

interface TotalSummaryCardProps {
  totalAmount: string;
  monthlyData: Array<{
    month: string;
    amount: number;
    categories?: Array<{
      categoryId: string;
      name: string;
      color: string;
      amount: number;
    }>;
  }>;
}

export function TotalSummaryCard({ totalAmount, monthlyData }: TotalSummaryCardProps) {
  // Extract category names and colors for the pie chart
  const categoryNames = monthlyData.length > 0 && monthlyData[0].categories 
    ? monthlyData[0].categories.map(category => category.name)
    : [];
    
  const categoryColors = monthlyData.length > 0 && monthlyData[0].categories 
    ? monthlyData[0].categories.map(category => category.color)
    : [];
    
  const categoryAmounts = monthlyData.length > 0 && monthlyData[0].categories 
    ? monthlyData[0].categories.map(category => category.amount)
    : [];

  return (
    <Card>
      <CardHeader
        title={`Total Spend: $${parseFloat(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
      />
      <CardContent>
        <Grid container spacing={2}>
          {/* Monthly Trend Chart with ApexChart */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Spending Trend</Typography>
            <Box sx={{ height: '20rem' }}>
              <ApexChart
                type="bar"
                height={350}
                options={{
                  colors: categoryColors.length > 0 ? [categoryColors[0]] : ['#000'],
                  chart: {
                    toolbar: {
                      show: false,
                    },
                    zoom: {
                      enabled: false,
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '60%',
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  xaxis: {
                    categories: monthlyData.map(item => item.month),
                  },
                  yaxis: {
                    labels: {
                      formatter: (value) => `$${(value / 1000).toFixed(1)}k`,
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toFixed(2)}`,
                    },
                  },
                }}
                series={[{
                  name: 'Monthly Spend',
                  data: monthlyData.map(item => item.amount)
                }]}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>Spending by Category</Typography>
            <Box sx={{ height: '20rem' }}>
              <ApexChart
                type="pie"
                height={350}
                options={{
                  colors: categoryColors.length > 0 ? categoryColors : ['#1976d2', '#2e7d32', '#9e9e9e'],
                  labels: categoryNames.length > 0 ? categoryNames : [],
                  legend: {
                    position: 'bottom',
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val, opts) => {
                      return `${opts.w.globals.labels[opts.seriesIndex]}: ${typeof val === 'number' ? val.toFixed(1) : val}%`;
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toFixed(2)}`,
                    },
                  },
                }}
                series={categoryAmounts.length > 0 ? categoryAmounts : []}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 
