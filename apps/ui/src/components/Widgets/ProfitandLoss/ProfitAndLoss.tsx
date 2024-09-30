import { useEffect, useState } from "react";
import { Card, CardHeader, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { 
  chartExpenseSeries,
  chartIncomeSeries,
  fetchData, 
  get3MonthChange, 
  getNetForMonth, 
  GroupedMonthlyTotal,
} from "./utils";
import ApexChart from "react-apexcharts";
import { StyledLegend } from "../../StyledLegend";
import { formatCurrency } from "@budgeting/ui/utils/formatters";
import { ArrowDownward, ArrowUpward, TabUnselected } from "@mui/icons-material";
import classNames from "classnames";
import { grey, green } from "@mui/material/colors";
import { format } from "path";

const chartOptions = {
    yaxis: {
      labels: {
        show: true,
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
      }
    },
    chart: { type: 'bar' },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      }
    }
  }

export function ProfitAndLoss() {
  const [totals, setTotals] = useState<GroupedMonthlyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotals() {
      setLoading(true);
      const totals = await fetchData();

      setTotals(totals);
      setLoading(false);
    }

    fetchTotals();
  }, []);

  const renderContent = () => {
    const threeMonthChange = get3MonthChange(totals);
    const changeIcon = threeMonthChange > 0 ? <ArrowUpward /> : <ArrowDownward />;
    const changeColor = classNames(threeMonthChange > 0 ? 'text-green-800' : 'text-red-800');

    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Chart totals={totals} />
        </div>
        <div className="col-span-1">
          <div className="mb-4">
            <ProfitAndLossTable totals={totals} />
          </div>
          
          <StyledLegend 
            title={'3 Month Change:'}
            value={(
              <>
                <span className={changeColor}>
                  {changeIcon}
                  {formatCurrency(Math.abs(threeMonthChange), false)}
                </span>
              </>
            )}
          />

        </div>
      </div>
    )
  }
    
  return (
    <Card>
      <CardHeader 
        title="Profit and Loss"
        subheader="Last 3 Months"
      />
      {loading ? (
        <div className="flex justify-center items-center h-full p-10">
          <CircularProgress />
        </div>
      ) : renderContent()}
    </Card>
  )
}

function ProfitAndLossTable({ totals }: { totals: GroupedMonthlyTotal[] }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Month</TableCell>
          <TableCell>Net</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {totals.map((total) => (
          <TableRow key={total.month}>
            <TableCell>{total.month}/{total.year}</TableCell>
            <TableCell>
              {formatCurrency(getNetForMonth(total), false)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Chart({ totals }: { totals: GroupedMonthlyTotal[] }) {
  const series = {
    series: [
      { data: chartExpenseSeries(totals), name: 'Expenses' },
      { data: chartIncomeSeries(totals), name: 'Income' },
    ]
  }

  return (
    <ApexChart 
      series={series.series}
      type={'bar'}
      orientation={'vertical'}
      height={400}
      toolbar={{
        show: false,
      }}
      options={chartOptions}
    />
  )
}
