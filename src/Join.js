import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/outline'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Join(props) { //new online? game
    const [expanded, setExpanded] = useState(false);
    const [gameId, setgameId] = useState('');
    const [symbol, setSymbol] = useState('Y');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = ({ target }) => {
        setgameId(target.value);
    }

    const handleSymbolChange = ({ target }) => {
        // check target length is 0 or 1
        if (target.value.length >=0 && target.value.length <= 1) {
            setSymbol(target.value.toUpperCase());
        }
        // if length is 2, set to the new char
        if (target.value.length === 2) {
            let first = target.value.charAt(0).toUpperCase();
            if (first === symbol) {
                setSymbol(target.value.charAt(1).toUpperCase());
            } else {
                setSymbol(first);
            }
        }
    }

    const handleJoin = () => {
        if (!loading) {
            setLoading(true);
            var url = new URL("https://x.tmos.es/api/joinGame"),
              params = { idToken: props.user.accessToken, gameId: gameId, symbol: symbol }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
              .then(response => response.text())
              .then((response) => {
                console.log('response:');
                console.log(response);
                setLoading(false);
                if (response.includes('Cool!')) {
                    props.setgameId(gameId);
                } else {
                    setError(response);
                }
              })
              .catch(err => console.log(err))
          }
    }

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const gameIdInput = useRef(null)


    return ( // base style from: https://tailwindui.com/components/application-ui/overlays/modals
        <div>
                <button
                    type="button"
                    onClick={toggleExpand}
                    className=""
                >
                    Join
                </button>
            <Transition.Root show={expanded} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={gameIdInput} onClose={toggleExpand}>
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
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <PlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div className="flex-grow mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Join a game
                                            </Dialog.Title>
                                            {error && <div className="mt-2 text-sm leading-5 text-red-500">{error}</div>}
                                            <div className="mt-2">
                                                <div className='flex justify-between'>
                                                    <p className="text-sm text-gray-500">
                                                        Game ID:
                                                    </p>
                                                </div>
                                                <input
                                                    ref={gameIdInput}
                                                    value={gameId}
                                                    onChange={handleChange}
                                                    type="text"
                                                    spellcheck="false"
                                                    className="p-2 w-full rounded-lg border"
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <div className='flex justify-between'>
                                                    <p className="text-sm text-gray-500">
                                                        Player symbol:
                                                    </p>
                                                </div>
                                                <input
                                                    value={symbol}
                                                    onChange={handleSymbolChange}
                                                    type="text"
                                                    spellcheck="false"
                                                    className="p-2 w-full rounded-lg border"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className={classNames(loading ? 'animate-pulse' : '', "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50")}
                                        onClick={handleJoin}
                                    >
                                        Join
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
