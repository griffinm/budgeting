export function formatCurrency(
  amount: number | undefined | null,
  decimals: boolean = true,
): string {
  if (!amount) {
    return "$0.00";
  }
  
  let amountToFormat = amount;
  if (!decimals) {
    amountToFormat = Math.round(amount);
  }

  return `$${amountToFormat.toFixed(decimals ? 2 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
