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
                className="text-center p-4 font-extrabold text-xl w-full"
            >
                Exit
            </button>
        </div>)
}