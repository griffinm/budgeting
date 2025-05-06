import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { TransactionTable } from "@budgeting/ui/components/TransactionTable/TransactionTable";
import { useEffect, useState } from "react";
import { fetchTransactions } from "@budgeting/ui/utils/api";

export function MerchantTransactions({
  merchantId,
}: {
  merchantId: string;
}) {
  const [transactions, setTransactions] = useState<AccountTransactionEntity[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTransactions({
      pagedRequest: { page, pageSize },
      filter: { merchantId },
    }).then((resp) => {
      setTransactions(resp.data.data);
      setTotalRecords(resp.data.totalRecords);
      setPage(resp.data.currentPage);
      setPageSize(resp.data.pageSize);
      setLoading(false);
    });
  }, [merchantId, startDate, endDate, page, pageSize]);

  return (
    <TransactionTable
      transactions={transactions}
      currentPage={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      totalRecords={totalRecords}
      loading={loading}
      showColumns={["date", "account", "amount", "actions"]}
    />
  )
}