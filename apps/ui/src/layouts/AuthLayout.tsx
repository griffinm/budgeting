import { Outlet } from "react-router-dom";
import { Card } from "@mui/material";
import { Logo } from "@budgeting/ui/components";

export function AuthLayout() {
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-r from-green-50 to-green-100">
      <div className="w-[90%] sm:w-[400px]">
        <Card sx={{ p: 3 }}>
          <div className="flex flex-col items-center">
            <Logo />
          </div>
          <div className="py-3">
            <Outlet />
          </div>
        </Card>
      
      </div>
    </div>
  )
}
