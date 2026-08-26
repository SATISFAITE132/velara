export type Currency = 'MAD';

export function getCurrencySymbol(
  currency: Currency = 'MAD'
): string {
  return 'د.م.';
}

export function formatPrice(
  amount: number,
  currency: Currency = 'MAD'
): string {
  return `${Number(amount).toFixed(2)} د.م.`;
}