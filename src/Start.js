import React, { useState } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Start(props) {

    const [loading, setLoading] = useState(false);

    const start = () => {
        var url = new URL("https://x.tmos.es/api/startGame"),
              params = { idToken: props.user.accessToken, gameId: props.gameId }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url)
              .then(response => response.json())
              .then((response) => {
                setLoading(false);
                console.log('response:', response);
              })
              .catch(err => console.log(err))
    }
    return (
        <div>
            <button
                type="button"
                className={classNames(loading ? 'animate-pulse' : '', "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50")}
                onClick={start}
            >
                Start
            </button>
        </div>)
}