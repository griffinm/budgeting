import { Outlet } from "react-router-dom";
import { Nav } from "@budgeting/ui/components";

export function AppLayout() {
  return (
    <div className="flex flex-row h-screen">
      <div className="flex-1">
        <Nav />
      </div>
      <div className="grow p-5">
        This is the content
        <Outlet />
      </div>
    </div>
  )
}
