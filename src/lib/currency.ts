export type Currency = 'USD' | 'EUR' | 'GBP';

export function getCurrencySymbol(currency: Currency) {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'USD':
    default:
      return '$';
  }
}
