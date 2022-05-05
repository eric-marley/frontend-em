import estados from './estados.json'

function isLatitudeValid(lat) {
    if (!String(lat).trim()) return false
    return isFinite(lat) && Math.abs(lat) <= 90;
}

function isLongitudeValid(lng) {
    if (!String(lng).trim()) return false
    return isFinite(lng) && Math.abs(lng) <= 180;
}

function isCepValid(cep) {
    return !!cep.match(/^[0-9]{5}-?[0-9]{3}$/);
}

function isEstadoValid(inputEstado) {
    if (!inputEstado) return false
    const sanitizedEstado = inputEstado.toLowerCase()
    const [valid] = estados.filter(estado => estado.nome.toLowerCase() === sanitizedEstado || estado.sigla.toLowerCase() === sanitizedEstado)
    return !!valid
}

function validateGeneralField(field) {
    if (!field) return false
    return field.trim().length >= 2
}

function validateFormSubmit(form) {
    const isValidLat = isLatitudeValid(form.latitude)
    const isValidLong = isLongitudeValid(form.longitude)
    const isValidCep = isCepValid(form.cep)
    const isValidEstado = isEstadoValid(form.estado)
    const isValidLogradouro = validateGeneralField(form.logradouro)
    const isValidNumero = validateGeneralField(form.numero)
    const isValidBairro = validateGeneralField(form.bairro)
    const isValidCidade = validateGeneralField(form.cidade)
    const isValid = isValidLat && isValidLong && isValidCep && isValidEstado && isValidLogradouro && isValidNumero && isValidBairro && isValidCidade
    return {
        isValid,
        logradouro: isValidLogradouro,
        numero: isValidNumero,
        bairro: isValidBairro,
        cidade: isValidCidade,
        estado: isValidEstado,
        cep: isValidCep,
        latitude: isValidLat,
        longitude: isValidLong,
    }
}

export {
    isLatitudeValid,
    isLongitudeValid,
    isCepValid,
    isEstadoValid,
    validateGeneralField,
    validateFormSubmit
}
