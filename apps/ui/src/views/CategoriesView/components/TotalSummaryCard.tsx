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
import { green, grey, blue } from "@mui/material/colors";

// Chart colors
const colors = [blue[500], green[500], grey[400], blue[300], green[300]];

interface TotalSummaryCardProps {
  totalAmount: string;
  monthlyData: Array<{
    month: string;
    amount: number;
  }>;
}

export function TotalSummaryCard({ totalAmount, monthlyData }: TotalSummaryCardProps) {
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
                  colors: colors,
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
                  colors: colors,
                  labels: monthlyData.length > 0 
                    ? Object.entries(monthlyData[0]).filter(([key]) => key !== 'month' && key !== 'amount' && key !== 'categories' && key !== 'totalAmount')
                        .map(([key]) => key)
                    : [],
                  legend: {
                    position: 'bottom',
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val, opts) => {
                      return `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`;
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toFixed(2)}`,
                    },
                  },
                }}
                series={monthlyData.length > 0 
                  ? Object.entries(monthlyData[0]).filter(([key]) => key !== 'month' && key !== 'amount' && key !== 'categories' && key !== 'totalAmount')
                      .map(([_, value]) => value as number)
                  : []
                }
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 
