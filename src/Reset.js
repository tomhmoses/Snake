import React, { useState } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Reset(props) {

    const [loading, setLoading] = useState(false);

    const reset = () => {
        var url = new URL("https://x.tmos.es/api/resetGame"),
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
                onClick={reset}
            >
                Play Again
            </button>
        </div>)
}