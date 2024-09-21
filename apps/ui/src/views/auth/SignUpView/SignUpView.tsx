import { useState } from "react";
import { TextField, Button, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { urls } from "@budgeting/ui/utils/urls";
import { createUser } from "@budgeting/ui/utils/api";
import cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@budgeting/ui/providers/UserProvider";

export const SignUpView = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid()) {
      return;
    }
    // TODO: Handle an error
    const response = await createUser({ name, email, password });
    const { jwt, user } = response.data;
    const cookie = new cookies();
    cookie.set('jwt', jwt);
    setUser(user);
    navigate(urls.home);
  }

  const isValid = () => {
    // TODO add error messages
    return name.length > 0 && email.length > 0 && password.length > 0;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center py-5">
        <Typography variant="h4">Sign Up</Typography>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
        >
          Sign Up
        </Button>
      </div>

      <div className="pt-4 flex justify-end">
        <Typography sx={{ color: 'text.secondary' }}>
          Already have an account?&nbsp;
        </Typography>
        <Link component={RouterLink} to={urls.signIn}>Sign In</Link>
      </div>
    </form>
  )
}
