export const routeLineLayer = {
    id: 'route-line',
    type: 'line',
    source: 'segments',
    paint: {
        'line-width': [
            'interpolate',
            // Set the exponential rate of change to 0.5
            ['exponential', 0.5],
            ['zoom'],
            11,
            2,
            16,
            12
        ],
        'line-color': '#2cbca2',
        'line-opacity': 0.85,
        'line-dasharray': [2, 1]
    }
}

export const threeDBuildingsLayer = {
    'id': 'add-3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
        'fill-extrusion-color': '#aaa',

        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
        ],
        'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
    }
}

