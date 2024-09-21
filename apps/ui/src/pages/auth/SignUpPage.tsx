import { Helmet } from 'react-helmet';
import { SignUpView } from '@budgeting/ui/views';

export default function SignIn() {
  <Helmet>
    <title>Sign Up | {import.meta.env.UI_APP_NAME}</title>
  </Helmet>

  return <SignUpView />;
}
