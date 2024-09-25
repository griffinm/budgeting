export function formatCurrency(amount: number | undefined | null): string {
  if (!amount) {
    return "$0.00";
  }
  
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

