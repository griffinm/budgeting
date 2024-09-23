import { Outlet } from "react-router-dom";
import { Nav } from "@budgeting/ui/components";

export function AppLayout() {
  return (
    <div className="flex flex-row h-screen">
      <div className="w-[250px]">
        <Nav />
      </div>
      <div className="grow p-5 max-w-[900px]">
        <Outlet />
      </div>
    </div>
  )
}
