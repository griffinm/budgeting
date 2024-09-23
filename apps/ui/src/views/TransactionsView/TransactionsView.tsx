import { useEffect, useState } from "react"
import { fetchTransactions } from "@budgeting/ui/utils/api";
import { ConnectedAccountEntity } from "@budgeting/api/transactions/dto/connected-account.entity";

export function TransactionsView() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    setLoading(true);
    fetchTransactions({
      pagedRequest: {
        page,
        pageSize,
      },
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Transactions View</h1>
    </div>
  )
}
