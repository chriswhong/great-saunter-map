import React, { Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
// eslint-disable-next-line
import mapboxgl from "!mapbox-gl";
import FontawesomeMarker from 'mapbox-gl-fontawesome-markers'

import FakeNavigator from "./util/fake-navigator.js";
import MarkerSVG, { markerAttributes } from './Marker.js'
import logo from './assets/img/logo.svg'

import points from './assets/data/points.json'
import route from './assets/data/route.json'


function App() {

  const [showModal, setShowModal] = useState(false)

  const cancelButtonRef = useRef(null)

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
        data: route
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



      points.features.forEach(({ geometry, properties }) => {


        let popupHtml = `
      <div>
        <div className="font-semibold">${properties.name}</div>
      `
        if (properties.description) {
          popupHtml += `<div>${properties.description}</div>`
        }

        popupHtml += '</div>'

        const {iconClass, color} = markerAttributes.find(d => d.type === properties.type)

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);
        new FontawesomeMarker({
          icon: iconClass,
          color
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
      <div className='absolute bottom-28 right-2.5 z-10'>
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button className="mapboxgl-ctrl-compass" type="button" aria-label="Reset bearing to north" onClick={() => {
            setShowModal(true)
          }}>
            <span className={`${locationArrowColorClass}`}><i className="fa-solid fa-info"></i></span>
          </button>
        </div>
      </div>
      <div className='absolute bottom-12 right-2.5 z-10'>
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button className="mapboxgl-ctrl-compass" type="button" aria-label="Reset bearing to north" onClick={handleLocationButtonClick}>
            <span className={`${locationArrowColorClass} -ml-0.5`}><i className="fa-solid fa-location-arrow"></i></span>
          </button>
        </div>
      </div>
      <div id="map" ref={mapContainer} className="map-container" />
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setShowModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        <img src={logo} alt="shorewalkers logo" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          About this Map
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-4">
                            Use this interactive map for wayfinding during the Great Saunter.
                          </p>

                          <div className='border rounded-lg p-4'>
                            <table className="table-auto text-xs font-bold mb-3">

                              <tbody>
                                <tr>
                                  <td className='pr-3'>
                                    <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="6.05187" height="5.52041" transform="matrix(0.609975 -0.792421 0.755469 0.655185 0.952248 25.8226)" fill="#2CBCA2" />
                                      <rect width="6.5174" height="5.52041" transform="matrix(0.609975 -0.792421 0.755469 0.655185 16.854 5.16452)" fill="#2CBCA2" />
                                      <rect width="13.5003" height="5.52041" transform="matrix(0.609975 -0.792421 0.755469 0.655185 6.63145 18.4447)" fill="#2CBCA2" />
                                    </svg>



                                  </td>
                                  <td className='text-left'>Route Line - Follow this path</td>
                                </tr>
                              </tbody></table>
                            <p className="text-xs text-gray-500 mb-3">
                              Important locations are labeled with markers. You can tap each marker for more information.
                            </p>
                            <table className="table-auto text-xs font-bold mb-2">

                              <tbody>

                                <tr>
                                  <td className='pr-3'><MarkerSVG type='restroom' /></td>
                                  <td className='text-left'>Restrooms</td>
                                </tr>
                                <tr>
                                  <td className='pr-3'><MarkerSVG type='landmark' /></td>
                                  <td className='text-left'>Points of Interest</td>
                                </tr>
                                <tr>
                                  <td className='pr-3'><MarkerSVG type='route-info' /></td>
                                  <td className='text-left'>Route Info</td>
                                </tr>
                              </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mb-3">
                              You can control the map view and have it follow your location as you walk. Be sure to allow permission when the map loads.
                            </p>
                            <table className="table-auto text-xs font-bold">

                              <tbody>

                                <tr className='h-10'>
                                  <td className='pr-3'><i className="text-xl fa-solid fa-hand-pointer"></i>
                                    </td>
                                  <td className='text-left'>Pinch to Zoom, use two fingers to rotate & pitch</td>
                                </tr>
                                <tr>
                                  <td className='pr-3'> <i className="text-xl fa-solid fa-location-arrow"/></td>
                                  <td className='text-left'>Tap this icon to keep your location centered</td>
                                </tr>

                              </tbody>
                            </table>



                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowModal(false)}
                    >
                      Got it!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default App;