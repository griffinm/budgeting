import { Helmet } from "react-helmet";
import { CategoriesView } from "@budgeting/ui/views";

export function CategoriesPage() {
  return (
    <>
      <Helmet>
        <title>Categories | Budgeting</title>
      </Helmet>

      <CategoriesView />
    </>
  )
}
