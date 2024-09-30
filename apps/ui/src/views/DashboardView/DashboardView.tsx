import { WelcomeCard } from "@budgeting/ui/components";
import { 
  MonthComparison,
  ProfitAndLoss,
} from "@budgeting/ui/components/Widgets";

export function DashboardView() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <MonthComparison />
      </div>
      <div>
        <ProfitAndLoss />
      </div>
    </div>
  )
}
