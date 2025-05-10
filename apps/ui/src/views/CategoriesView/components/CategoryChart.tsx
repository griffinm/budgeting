import React from 'react';
import { Box } from '@mui/material';
import ApexChart from 'react-apexcharts';
import { CategoryTransactionsDto } from '@budgeting/api/Spend/dto/spend-summary.dto';

export interface CategoryChartProps {
  categories: CategoryTransactionsDto[];
  categoryColors: string[];
}

export function CategoryChart({ categories, categoryColors }: CategoryChartProps) {
  const categoryNames = categories.map(category => category.categoryName);
  const categoryAmounts = categories.map(category => parseFloat(category.totalAmount));

  return (
    <Box sx={{ height: '20rem' }}>
      <ApexChart
        type="pie"
        height={350}
        options={{
          colors: categoryColors,
          labels: categoryNames,
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            onItemClick: {
              toggleDataSeries: true
            },
            formatter: (seriesName, opts) => {
              return [seriesName, ': $', categoryAmounts[opts.seriesIndex].toFixed(2)].join('')
            }
          },
          dataLabels: {
            enabled: true,
            formatter: (val, opts) => {
              return `${typeof val === 'number' ? val.toFixed(1) : val}%`;
            },
          },
          tooltip: {
            y: {
              formatter: (value) => `$${value.toFixed(2)}`,
            },
          },
          chart: {
            events: {
              dataPointSelection: function(event, chartContext, config) {
                console.log('Category selected:', categoryNames[config.dataPointIndex]);
              }
            }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }}
        series={categoryAmounts}
      />
    </Box>
  );
} 
