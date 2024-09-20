import { Outlet } from "react-router-dom";
import { Card, CardHeader } from "@mui/material";
import { Logo } from "@budgeting/ui/components";
import { components } from "@budgeting/ui/theme/core/components";

interface Props {
  title: string;
}

export function AuthLayout({
  title,
}: Props) {

  components.MuiCard

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="w-[90%] sm:w-[400px]">
        <Card sx={{ p: 3 }}>
          <div className="flex flex-col items-center">
            <Logo />
          </div>
          <div className="pb-5">
            <CardHeader title={title} />
          </div>
          <Outlet />
        </Card>
      
      </div>
    </div>
  )
}
