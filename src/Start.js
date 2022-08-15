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
        <div className='text-center p-4'>
            <button
                type="button"
                className={classNames(loading ? 'animate-pulse' : '', "font-extrabold text-xl text-center")}
                onClick={start}
            >
                Start
            </button>
        </div>)
}