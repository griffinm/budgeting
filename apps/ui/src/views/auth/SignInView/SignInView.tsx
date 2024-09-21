import { useState } from "react";
import { TextField, Button, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { urls } from "@budgeting/ui/utils/urls";
import { useUser } from "@budgeting/ui/providers/UserProvider";
import { signIn } from "@budgeting/ui/utils/api/authClient";
import cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

export function SignInView() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid()) {
      return;
    }
    // TODO: Handle an error
    signIn({ email, password })
      .then((response) => {
        const { jwt, user } = response.data;
        const cookie = new cookies();
        cookie.set('jwt', jwt);
        setUser(user);
        navigate(urls.home);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  const isValid = () => {
    // TODO add error messages
    return email.length > 0 && password.length > 0;
  }

  return (
    <form>
      <div className="flex flex-col items-center py-5">
        <Typography variant="h4">Sign In</Typography>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
