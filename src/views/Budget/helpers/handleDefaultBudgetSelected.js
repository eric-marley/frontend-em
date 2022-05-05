export default function (budgets, previousBudget) {
  let total = []
  const newBudgets = budgets.map((budget, index) => {
    const newBudgetDetail = budget[1].map((budgetDetails) => {
      if (previousBudget.some(item => item[0] === budget[0] && item[1].tipo === budgetDetails.tipo)){
        total[index] = budgetDetails.investimento
        return {
          ...budgetDetails,
          selected: true,
        };
      }
      return {
        ...budgetDetails,
      };
    });
    return [budget[0], newBudgetDetail];
  });
  return {newBudgets, total};
}
