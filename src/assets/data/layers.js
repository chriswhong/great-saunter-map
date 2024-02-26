export const routeLineLayer = {
    id: 'route-line',
    type: 'line',
    slot: 'middle',
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
            6
        ],
        'line-color': '#EC4A40',
        'line-opacity': 0.8,
        'line-dasharray': [2, 1]
    }
}

