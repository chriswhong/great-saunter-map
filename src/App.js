import React, { useRef, useEffect, useState } from "react";
// eslint-disable-next-line
import mapboxgl from "!mapbox-gl";
import FontawesomeMarker from 'mapbox-gl-fontawesome-markers'

import FakeNavigator from "./util/fake-navigator.js";

import points from './data/points.js'

function App() {

  const [mapState, setMapState] = useState('FREE')
  const [userLocation, setUserLocation] = useState()
  
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  // closure issues prevent us from accessing state in some callbacks, so use refs to make sure we can get them
  const mapStateRef = useRef();
  const userLocationRef = useRef();

  mapStateRef.current = mapState;
  userLocationRef.current = userLocation

  const flyToCenter = () => {
    mapRef.current.flyTo({
      center: userLocationRef.current,
      zoom: 16,
      duration: 1000,
      pitch: 0
    }, { // add eventData so we can distinguish programmatic camera controls from user interactions
      source: 'computer'
    })
  }

  const handleLocationButtonClick = () => {
    
    if (mapState === 'FREE') {
      setMapState('CENTER')

      flyToCenter()
    }
  }

  const handlePositionSuccess = (position) => {
    const { longitude, latitude } = position.coords
    setUserLocation([longitude, latitude])

    // if we are in CENTER mode, follow the user on each position update
    if (mapStateRef.current === 'CENTER') {
      flyToCenter()
    }
  }

  const handleUserInteraction = (e) => {
    // do nothing if the camera change came from the code
    if (e.source) return
    // go back to FREE mode if the user interacts with the map
    if (mapStateRef.current === 'CENTER') {
      setMapState('FREE')
    }
  }

  // initialize the map
  useEffect(() => {
    if (mapRef.current) return; // initialize map only once

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2hvcmV3YWxrZXIiLCJhIjoiY2xjdjd3NDNvMGZ4dDNyb2V6M3lod25sMSJ9.xfUWxjoeyD7beoCBIvN1xQ';

    const map = mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      bounds: [
        [
          -73.90679447981988,
          40.88426260944442
        ],
        [
          -74.02759930511121,
          40.69495574763582
        ],
      ],
      hash: true,
      pitch: 56,
      zoom: 10,
      minZoom: 7
    });

    map.addControl(new mapboxgl.NavigationControl({
      showZoom: false,
      visualizePitch: true
    }));

    class ExtendedGeolocateControl extends mapboxgl.GeolocateControl {
      _updateCamera(position) {
        // don't let the geolocate control follow the user when there is a new position received, we will do that on our own
      }
    }

    // Add geolocate control to the map.
    const geolocateControl = new ExtendedGeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
      // geolocation: new FakeNavigator()
    })
    map.addControl(
      geolocateControl
    );

    geolocateControl
      .on('geolocate', (position) => {
        handlePositionSuccess(position)
      });


    map.on('load', () => {
      geolocateControl.trigger()

      // Set the default atmosphere style
      map.setFog({});

      map.addSource('segments', {
        type: 'geojson',
        data: 'data/segments.geojson'
      })

      map.addLayer({
        id: 'segments-line',
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
      })

      const colors = {
        'fa-solid fa-restroom': '#7c7d80',
        'fa-solid fa-person-hiking': '#2cbca2',
        'fa-solid fa-landmark': '#3254a8',
        'fa-solid fa-flag-checkered': 'green'
      }

      points.features.forEach(({ geometry, properties }) => {
        let popupHtml = `
      <div>
        <div class="font-semibold">${properties.name}</div>
      `
        if (properties.description) {
          popupHtml += `<div>${properties.description}</div>`
        }

        popupHtml += '</div>'

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);
        new FontawesomeMarker({
          icon: properties.icon,
          color: colors[properties.icon]
        })
          .setLngLat(geometry.coordinates)
          .setPopup(popup)
          .addTo(map);
      })
    });

    map.on('style.load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
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
        },
        labelLayerId
      );
    });

    map.on('click', handleUserInteraction)
    map.on('dragstart', handleUserInteraction)
    map.on('rotatestart', handleUserInteraction)
    map.on('rotatestart', handleUserInteraction)
    map.on('zoomstart', handleUserInteraction)
  });

  const locationArrowColorClass = mapState === 'CENTER' ? 'text-blue-400' : ''

  return (
    <>
      <div className='absolute bottom-12 right-2.5 z-10'>
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button className="mapboxgl-ctrl-compass" type="button" aria-label="Reset bearing to north" onClick={handleLocationButtonClick}>
            <span className={`${locationArrowColorClass} -ml-0.5`}><i className="fa-solid fa-location-arrow"></i></span>
          </button>
        </div>
      </div>
      <div id="map" ref={mapContainer} className="map-container" />
    </>
  )
}

export default App;