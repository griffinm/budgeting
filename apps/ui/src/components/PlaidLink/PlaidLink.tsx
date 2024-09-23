import { usePlaidLink } from "react-plaid-link";

interface PlaidLinkProps {
  token: string;
  onGetPublicToken: (publicToken: string) => void;
}

export function PlaidLink({
  token,
  onGetPublicToken,
}: PlaidLinkProps
) {

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (public_token: string, metadata: any) => {
      onGetPublicToken(public_token);
    },
    onEvent: (eventName: string, metadata: any) => {
      // console.log(eventName, metadata);
    },
    onExit: (error: any, metadata: any) => {
      // console.log(error, metadata);
    },
  });

  open();

  return null;
};
