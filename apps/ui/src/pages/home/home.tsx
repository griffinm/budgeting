import { Helmet } from "react-helmet-async";
import { DashboardView } from "../../views";

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Budgeting</title>
      </Helmet>
      <DashboardView />
    </>
  )
}
