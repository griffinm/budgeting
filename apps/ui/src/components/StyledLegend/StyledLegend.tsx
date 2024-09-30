import { Box, styled, Typography } from "@mui/material";
import React from "react";

interface Props {
  title: React.ReactNode;
  value: React.ReactNode;
}

const Container = styled(Box)(({ theme }) => ({
  gap: 6,
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightMedium,
}));

export const StyledLegend = ({ title, value }: Props) => {
  return <Container>
    <div>
      {title}
    </div>
    <Typography variant="h6">{value}</Typography>
  </Container>
}


