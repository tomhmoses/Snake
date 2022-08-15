import React from 'react';

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

export function Players(props) {
    // turn, players, winner, user
    
    return (
        <div>
            {/* list of the players in the game */}
            <div className='flex'>
                {props.players.map((player, index) => (
                    <div key={index} className='flex'>{player}</div>
                        ))}
            </div>
        </div>
    )
}