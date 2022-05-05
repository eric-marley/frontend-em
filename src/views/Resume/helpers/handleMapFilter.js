export default function (mapData, mapFilters) {
    const newMap = {
        type: mapData.type,
        features: []
    }
    mapData.features.map(mapa => {
        if (mapFilters.includes(mapa.properties.midia)) {
            newMap.features.push(mapa)
        }
    })
    return newMap
}