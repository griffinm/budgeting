import { Helmet } from 'react-helmet';
import { SignInView } from '@budgeting/ui/views';

export default function SignIn() {
  <Helmet>
    <title>Sign In | {import.meta.env.UI_APP_NAME}</title>
  </Helmet>

  return <SignInView />;
}
