import React from 'react';
import { Box } from '@mui/material';
import ApexChart from 'react-apexcharts';
import { green, grey, blue } from "@mui/material/colors";

// Chart colors
const colors = [blue[500], green[500], grey[400], blue[300], green[300]];

interface CategoryChartProps {
  categories: Array<{
    categoryId: string;
    categoryName: string;
    totalAmount: string;
  }>;
}

export function CategoryChart({ categories }: CategoryChartProps) {
  return (
    <Box sx={{ height: '300px', mt: 2, mb: 4 }}>
      <ApexChart
        type="bar"
        height={300}
        options={{
          colors: colors,
          chart: {
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
              dataLabels: {
                position: 'top',
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: (val) => `$${val.toFixed(2)}`,
            offsetX: 30,
          },
          xaxis: {
            categories: categories.map(cat => cat.categoryName),
            labels: {
              formatter: (value) => `$${parseFloat(value).toFixed(0)}`,
            },
          },
          tooltip: {
            y: {
              formatter: (value) => `$${value.toFixed(2)}`,
            },
          },
        }}
        series={[
          {
            name: 'Spend',
            data: categories.map(cat => parseFloat(cat.totalAmount)),
          }
        ]}
      />
    </Box>
  );
} 
