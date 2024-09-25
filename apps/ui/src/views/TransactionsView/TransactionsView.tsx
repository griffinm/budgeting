import { useEffect, useState } from "react"
import { fetchTransactions, syncTransactions } from "@budgeting/ui/utils/api";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { Button, Typography } from "@mui/material";
import { TransactionTable } from "@budgeting/ui/components/TransactionTable";
import { Loading } from "@budgeting/ui/components";

export function TransactionsView() {
  const [transactions, setTransactions] = useState<AccountTransactionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  useEffect(() => {
    setLoading(true);
    fetchTransactions({
      pagedRequest: {
        page,
        pageSize,
      },
    }).then((resp) => {
      setTransactions(resp.data.data);
      setTotalRecords(resp.data.totalRecords);
    }).finally(() => {
      setLoading(false);
    });
  }, [page, pageSize]);

  const handleSyncTransactions = () => {
    setLoading(true);
    syncTransactions().then(() => {
      fetchTransactions({
        pagedRequest: {
          page: 1,
          pageSize,
        },
      }).then((resp) => {
        setTransactions(resp.data.data);
        setTotalRecords(resp.data.totalRecords);
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <div>
      <div className="flex flex-row justify-between pb-7">
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleSyncTransactions}
        >
          {loading ? 'Syncing...' : 'Update Now'}
        </Button>
      </div>

      {loading && <Loading />}
      {!loading && (
        <TransactionTable
          transactions={transactions}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalRecords={totalRecords}
        />
      )}
    </div>
  )
}
