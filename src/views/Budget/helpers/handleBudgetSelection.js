export default function (budgets, selectedBudget, selectedIndexFromBudgetList) {
  let total = 0
    const newBudgets = budgets[selectedIndexFromBudgetList][1].map(budget => {
        if (budget.idSimulacao !== selectedBudget) {
            delete budget.selected
            return budget
        }
        total = budget.investimento
        return {
            ...budget,
            selected: true
        }
    })
    return {newBudgets, total}
}