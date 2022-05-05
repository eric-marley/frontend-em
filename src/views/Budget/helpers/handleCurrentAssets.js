import airportIcon from '@/assets/airportIcon.svg'
import elevatorIcon from '@/assets/elevatorIcon.svg'
import escalatorIcon from '@/assets/escalatorIcon.svg'
import streetMidiaIcon from '@/assets/streetMidiaIcon.svg'
import trainIcon from '@/assets/trainIcon.svg'
import checkBudgetIcon from '@/assets/checkBudgetIcon.svg'
import uncheckBudgetIcon from '@/assets/uncheckBudgetIcon.svg'

export default function (availableAssets) {
    const assets = {
        'Ruas': {
            check: checkBudgetIcon,
            icon: streetMidiaIcon,
            text: 'Mídia de rua'
        },
        'Edifícios Residenciais': {
            check: checkBudgetIcon,
            icon: elevatorIcon,
            text: 'Edifícios Residenciais'
        },
        'Edifícios Comerciais': {
            check: checkBudgetIcon,
            icon: elevatorIcon,
            text: 'Edifícios Comerciais'
        },
        'Estabelecimentos': {
            check: checkBudgetIcon,
            icon: elevatorIcon,
            text: 'Estabelecimentos Comerciais'
        },
        'Shoppings': {
            check: checkBudgetIcon,
            icon: escalatorIcon,
            text: 'Shoppings'
        },
        'Aeroportos': {
            check: checkBudgetIcon,
            icon: airportIcon,
            text: 'Aeroportos'
        },
        'Transportes': {
            check: checkBudgetIcon,
            icon: trainIcon,
            text: 'Transporte sobre trilhos'
        }
    }

    const unavailableBudgetAssets = []
    const budgetAssets = []
    availableAssets.midias.map(asset => {
        if (asset.available) {
            return budgetAssets.push(assets[asset.nome])
        }
        const unavailable = {
            ...assets[asset.nome],
            check: uncheckBudgetIcon
        }
        unavailableBudgetAssets.push(unavailable)
    })
    return {
        available: budgetAssets,
        unavailable: unavailableBudgetAssets
    }
}