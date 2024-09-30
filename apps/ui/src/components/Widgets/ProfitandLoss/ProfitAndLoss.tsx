import { useEffect, useState } from "react";
import { Card, CardHeader, CircularProgress } from "@mui/material";
import { 
  fetchData, 
  GroupedMonthlyTotal,
} from "./utils";
import ApexChart from "react-apexcharts";
import { MenuBookSharp } from "@mui/icons-material";

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
    const expenseSeries = totals.map((total) => {
      return {
        x: `${total.month}/${total.year}`,
        y: Math.abs(total.totals.find((t) => t.type === 'expenses')?.amount ?? 0),
      }
    })

    const incomeSeries = totals.map((total) => {
      return {
        x: `${total.month}/${total.year}`,
        y: Math.abs(total.totals.find((t) => t.type === 'income')?.amount ?? 0),
      }
    })

    const series = {
      series: [
        { data: expenseSeries, name: 'Expenses' },
        { data: incomeSeries, name: 'Income' },
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
        options={
          {
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
        }
      />
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
function subtractMonths(today: Date, arg1: number): any {
  throw new Error("Function not implemented.");
}

