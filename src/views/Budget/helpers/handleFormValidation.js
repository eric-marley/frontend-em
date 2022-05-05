export default function (budgets) {
    const totalOfRegions = budgets.length
    let currentSelected = 0
    budgets.map(budget => {
        budget[1].map(budgetDetails => {
            if (budgetDetails.selected) {
                return currentSelected += 1
            }
        })
    })

    return totalOfRegions === currentSelected
}