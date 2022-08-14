import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/outline'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function New(props) { //new online? game
    const [expanded, setExpanded] = useState(false);
    const [boardSize, setBoardSize] = useState(3);
    const [loading, setLoading] = useState(false);

    const handleChange = ({ target }) => {
        setBoardSize(target.value);
    }

    const handleCreate = () => {
        // TODO
    }

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const boardSizeInput = useRef(null)


    return ( // base style from: https://tailwindui.com/components/application-ui/overlays/modals
        <div>
                <button
                    type="button"
                    onClick={toggleExpand}
                    className=""
                >
                    New
                </button>
            <Transition.Root show={expanded} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={boardSizeInput} onClose={toggleExpand}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <PlusIcon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                                        </div>
                                        <div className="flex-grow mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Create a new game
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <div className='flex justify-between'>
                                                    <p className="text-sm text-gray-500">
                                                        Board Size:
                                                    </p>
                                                </div>
                                                <input
                                                    ref={boardSizeInput}
                                                    value={boardSize}
                                                    onChange={handleChange}
                                                    className="p-2 w-full rounded-lg border"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className={classNames(loading ? 'animate-pulse' : '', "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50")}
                                        onClick={handleCreate}
                                        disabled={!(boardSize > 0)} //TODO: check this is an integer
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                                        onClick={toggleExpand}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );

}
