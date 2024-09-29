import { useEffect, useState } from "react";
import { getCumlativeDailySpend } from "@budgeting/ui/utils/api";
import { DailySpend } from "@budgeting/types";
import { Box, Card, CardContent, CardHeader, CircularProgress, Stack, styled, Typography } from "@mui/material";
import ApexChart from 'react-apexcharts';
import { getFinalSpendTotal, getSpendTotalOnDay } from "./utils";
import { formatCurrency } from "@budgeting/ui/utils/formatters";
import { green, grey } from "@mui/material/colors";
import { format } from "date-fns";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import classnames from "classnames";

const colors = [grey[400],green[500]];

export const StyledLegend = styled(Box)(({ theme }) => ({
  gap: 6,
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightMedium,

}));

export function MonthComparison() {
  const [currentMonthLoading, setCurrentMonthLoading] = useState(false);
  const [previousMonthLoading, setPreviousMonthLoading] = useState(false);
  const [currentMonthSpend, setCurrentMonthSpend] = useState<DailySpend[]>([]);
  const [previousMonthSpend, setPreviousMonthSpend] = useState<DailySpend[]>([]);
  const loading = currentMonthLoading || previousMonthLoading;
  const currentMonthSpendTotal = getFinalSpendTotal(currentMonthSpend);
  const previousMonthSpendTotal = getFinalSpendTotal(previousMonthSpend);
  const previousMonthSpendTotalOnCurrentDay = getSpendTotalOnDay(previousMonthSpend, format(new Date(), 'd'));
  const percentChange = ((currentMonthSpendTotal - previousMonthSpendTotalOnCurrentDay) / previousMonthSpendTotalOnCurrentDay) * 100;
  const spendUp = currentMonthSpendTotal > previousMonthSpendTotalOnCurrentDay;
  const changeClasses = classnames('text-sm', {
    'text-red-800': percentChange > 0,
    'text-green-800': percentChange < 0,
  });

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const previousMonth = currentMonth - 1;
    const previousYear = currentYear;
    setCurrentMonthLoading(true);
    setPreviousMonthLoading(true);

    // Get the current month
    getCumlativeDailySpend({
      month: currentMonth,
      year: currentYear,
    }).then((resp) => {
      setCurrentMonthSpend(resp.data);
    }).finally(() => {
      setCurrentMonthLoading(false);
    });

    // Get the previous month
    getCumlativeDailySpend({
      month: previousMonth,
      year: previousYear,
    }).then((resp) => {
      setPreviousMonthSpend(resp.data);
    }).finally(() => {
      setPreviousMonthLoading(false);
    });
  }, []);

  const renderChart = () => {
    return (
      <div>
        <ApexChart
          type="line"
          toolbar={{
            show: false,
          }}
          zoom={{
            enabled: false,
          }}
          options={{
            colors: colors,
            stroke: {
              width: 3,
              curve: 'smooth',
            },
            yaxis: {
              labels: {
                show: true,
                formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
              },
            },
            xaxis: {
              labels: {
                show: false,
              },
              type: 'datetime',
              categories: previousMonthSpend.map((day) => day.date),
            },
          }}
          series={[
            {
              name: 'Previous Month',
              data: previousMonthSpend.map((day) => day.spend),
            },
            {
              name: 'Current Month',
              data: currentMonthSpend.map((day) => day.spend),
            },
          ]}
        />
      </div>
    )
  }

  const renderOverview = () => {
    return (
      <div className="flex flex-row gap-[50px]">
        <StyledLegend>
            <Box>
              This Month
              <span className={changeClasses}>
                {spendUp ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                ({percentChange.toFixed(1)}%)
              </span>
            </Box>
            <Box sx={{ typography: 'h6' }}>
              {formatCurrency(currentMonthSpendTotal, false)}
          </Box> 
        </StyledLegend>

        <StyledLegend>
          <Box>
            Last Month On This Day
          </Box>
          <Box sx={{ typography: 'h6' }}>
            {formatCurrency(previousMonthSpendTotalOnCurrentDay, false)}  
          </Box> 
        </StyledLegend>

        <StyledLegend>
          <Box>
            Last Month Total
          </Box>
          <Box sx={{ typography: 'h6' }}>
            {formatCurrency(previousMonthSpendTotal, false)}  
          </Box> 
        </StyledLegend>
      </div>
    )
  }

  return (
    <Card sx={{ padding: 0}}>
      <CardHeader title="Spend" subheader="Current Month vs Previous Month" />
      <CardContent>
        {loading ? <CircularProgress /> : (
          <div>
            {renderOverview()}
            {renderChart()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
