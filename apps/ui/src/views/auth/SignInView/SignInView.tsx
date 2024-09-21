import { TextField, Button, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { urls } from "@budgeting/ui/utils/urls";

export function SignInView() {
  return (
    <form>
      <div className="flex flex-col items-center py-5">
        <Typography variant="h4">Sign In</Typography>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TextField label="Email" />
        <TextField label="Password" type="password" />
        <Button variant="contained" color="primary" fullWidth type="submit">Sign In</Button>
      </div>

      <div className="pt-4 flex justify-end">
        <Typography sx={{ color: 'text.secondary' }}>
          Don&apos;t have an account?&nbsp;
        </Typography>
        <Link component={RouterLink} to={urls.signUp}>Sign Up</Link>
      </div>
    </form>
  )
}
