import { Typography } from "@mui/material";

export function PageHeader({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-5">
      <Typography variant="h4">{title}</Typography>
    </div>
  )
}
