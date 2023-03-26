import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'

import logo from './assets/img/logo.svg'


const SplashModal = ({ showModal, setShowModal, setDontShowAgain }) => {
    const cancelButtonRef = useRef(null)

    const [checked, setChecked] = useState(false);

    return (
        <Transition.Root show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-30" initialFocus={cancelButtonRef} onClose={setShowModal}>
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
                                                Location Services Reminder
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-4">
                                                    This map can show your location while you walk. To use this feature you must enable location services on your mobile device and give permission for this page to access your location.
                                                </p>

                                                <div className='border rounded-lg p-4'>

                                                    <div className='font-bold mb-1 text-sm'>How to enable Location services</div>
                                                    <ul className="list-disc ml-4 text-xs text-left">
                                                        <li><a className='font-medium text-blue-600 dark:text-blue-500 hover:underline"' href='https://support.apple.com/en-us/HT207092' target='_blank' rel="noreferrer"><i className="fa-brands fa-apple"></i> iOS</a></li>
                                                        <li><a className='font-medium text-blue-600 dark:text-blue-500 hover:underline"' href='https://support.google.com/accounts/answer/3467281?hl=en' target='_blank' rel="noreferrer"><i className="fa-brands fa-android"></i> Android</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:px-6 items-center">
                                    <div className='text-right mb-2 sm:mb-0 flex-grow'>
                                        <label className='text-sm'>
                                            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> Don't show this message again
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            setShowModal(false)
                                            setDontShowAgain(checked)
                                        }}
                                    >
                                        Let's go!
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

export default SplashModal