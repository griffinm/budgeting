import { usePlaidLink } from "react-plaid-link";

interface PlaidLinkProps {
  token: string;
}

export function PlaidLink({
  token,
}: PlaidLinkProps
) {

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (public_token: string, metadata: any) => {
      console.log("Public token", public_token);
      console.log("Metadata", metadata);
    },
    onEvent: (eventName: string, metadata: any) => {
      // console.log(eventName, metadata);
    },
    onExit: (error: any, metadata: any) => {
      // console.log(error, metadata);
    },
  });

  open();

  return (
    <div>
      Plaid Link
    </div>
  )
};
