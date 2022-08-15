import React from 'react';

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

export function Players(props) {
    // turn, players, winner, user
    var players = [];
    for (var key in props.players) {
        if (props.players.hasOwnProperty(key)) {
            players.push( {...props.players[key]} );
        }
    }
    players.sort(function(first, second) {
        return second.playerNum - first.playerNum;
    });
    
    return (
        <div>
            {/* list of the players in the game */}
            <div className='flex'>
                {players.map((player, index) => (
                    <div key={index} className='flex'>{player.symvol}</div>
                        ))}
            </div>
        </div>
    )
}