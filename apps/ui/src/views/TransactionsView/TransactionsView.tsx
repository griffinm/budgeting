import { useEffect, useMemo, useState } from "react"
import { fetchTransactions, syncTransactions } from "@budgeting/ui/utils/api";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { Button, Typography } from "@mui/material";
import { TransactionTable } from "@budgeting/ui/components/TransactionTable";
import { AccountSelect } from "@budgeting/ui/components/AccountSelect";

interface TransactionFilter {
  connectedAccountId?: string;
}

export function TransactionsView() {
  const [transactions, setTransactions] = useState<AccountTransactionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [accountFilter, setAccountFilter] = useState<string>("");

  const filter = useMemo(() => {
    const f: TransactionFilter = {};
    if (accountFilter) {
      f.connectedAccountId = accountFilter;
    }
    return f;
  }, [accountFilter]);

  // Load the transactions when paging info changes
  useEffect(() => {
    setLoading(true);
    fetchTransactions({
      pagedRequest: {
        page,
        pageSize,
      },
      filter,
    }).then((resp) => {
      setTransactions(resp.data.data);
      setTotalRecords(resp.data.totalRecords);
    }).finally(() => {
      setLoading(false);
    });
  }, [page, pageSize, accountFilter]);

  const handleSyncTransactions = () => {
    setSyncing(true);
    syncTransactions().then(() => {
      fetchTransactions({
        pagedRequest: {
          page: 1,
          pageSize,
        },
        filter,
      }).then((resp) => {
        setTransactions(resp.data.data);
        setTotalRecords(resp.data.totalRecords);
        setPage(1);
      });
    }).finally(() => {
      setSyncing(false);
    });
  }

  return (
    <div>
      <div className="flex flex-row justify-between pb-7">
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={syncing}
          onClick={handleSyncTransactions}
        >
          {syncing ? 'Syncing...' : 'Update Now'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 pb-7">
        <AccountSelect
          selectedAccountId={accountFilter}
          onChange={setAccountFilter}
          label="Filter by Account"
        />
      </div>

      <TransactionTable
        loading={loading}
        transactions={transactions}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalRecords={totalRecords}
      />
    </div>
  )
}
