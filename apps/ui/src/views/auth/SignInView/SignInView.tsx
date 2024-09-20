import { TextField, Button } from "@mui/material";

export function SignInView() {
  return (
    <form>
      <div className="grid grid-cols-1 gap-4">
        <TextField label="Email" />
        <TextField label="Password" type="password" />
        <Button variant="contained" color="primary" fullWidth type="submit">Sign In</Button>
      </div>
    </form>
  )
}
