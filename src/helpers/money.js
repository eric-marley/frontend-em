export default {
  convertToCurrency: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
  convertToDecimal: (value, maximumDigits = 20) => new Intl.NumberFormat('pt-BR', { style: 'decimal', maximumSignificantDigits: maximumDigits }).format(value),
  convertToPercentage: (value, digits = 2) => {
    const [number] = new Intl.NumberFormat('pt-BR', { style: 'percent' }).format(value).split('%')
    return `${parseFloat(number, 10).toFixed(digits)}%`
  },
}
