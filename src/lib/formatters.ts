const CURRENCY_FORMATTER = new Intl.NumberFormat("it", {
  currency: "EUR",
  style: "currency",
  minimumFractionDigits: 0,
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat("it")

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}
