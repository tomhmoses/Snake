import React from 'react';

export function Exit(props) {
    const exit = () => {
        props.setGameId(null);
    }
    return (
        <div>
            <button
                type="button"
                onClick={exit}
                className=""
            >
                Exit
            </button>
        </div>)
}