const fs = require('fs')

const linestringsFC = require('../src/assets/data/route-old.json')

console.log(linestringsFC)

const { features } = linestringsFC



let consolidatedCoordinates = []

features.forEach(({geometry: { coordinates }}) => {
    consolidatedCoordinates = [
        ...consolidatedCoordinates,
        ...coordinates
    ]
})

const newLineString = {
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: consolidatedCoordinates
    },
    properties: {}
}

const newFC = {
    type: 'FeatureCollection',
    features: [
        newLineString
    ]
}

fs.writeFileSync(__dirname + '/../src/assets/data/route.json', JSON.stringify(newFC, null, 2))

