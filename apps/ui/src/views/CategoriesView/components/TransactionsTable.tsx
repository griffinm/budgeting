import React from 'react';
import { Box } from '@mui/material';
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";

interface TransactionsTableProps {
  transactions: AccountTransactionEntity[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Box sx={{ maxHeight: '15rem', overflow: 'auto', mt: 2 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
            <th style={{ paddingBottom: '0.5rem' }}>Date</th>
            <th style={{ paddingBottom: '0.5rem' }}>Merchant</th>
            <th style={{ paddingBottom: '0.5rem', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
              <td style={{ padding: '0.5rem 0' }}>
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td style={{ padding: '0.5rem 0' }}>
                {transaction.merchant.merchantName}
              </td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                ${parseFloat(transaction.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
} 
