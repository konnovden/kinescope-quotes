export function fmt(amount: number, currency: string = 'RUB') {
  try {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(amount || 0)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}
