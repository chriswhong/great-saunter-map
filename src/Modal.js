import React, {Fragment, useRef} from 'react';
import { Dialog, Transition } from '@headlessui/react'

import MarkerSVG from './Marker.js'
import logo from './assets/img/logo.svg'

const Modal = ({ showModal, setShowModal }) => {
    const cancelButtonRef = useRef(null)

    return (
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
                                      <td className='pr-3'><MarkerSVG type='restrooms' /></td>
                                      <td className='text-left'>Restrooms</td>
                                    </tr>
                                    <tr>
                                      <td className='pr-3'><MarkerSVG type='refreshments' /></td>
                                      <td className='text-left'>Refreshments</td>
                                    </tr>
                                    <tr>
                                      <td className='pr-3'><MarkerSVG type='route-info' /></td>
                                      <td className='text-left'>Route Info</td>
                                    </tr>
                                    <tr>
                                      <td className='pr-3'><MarkerSVG type='mile-marker' /></td>
                                      <td className='text-left'>Mile Markers</td>
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
    )
}

export default Modal