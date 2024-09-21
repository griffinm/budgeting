import { Outlet } from "react-router-dom";
import { Nav } from "@budgeting/ui/components";

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      {/* <Outlet /> */}
    </div>
  )
}
