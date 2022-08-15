import React from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Players(props) {
    // turn, players, winner, user
    var players = [];
    for (var key in props.players) {
        if (props.players.hasOwnProperty(key)) {
            players.push( {...props.players[key], uid: key} );
        }
    }
    players.sort(function(first, second) {
        return second.playerNum - first.playerNum;
    });
    var turn = props.turn % players.length;
    
    return (
        <div>
            <div className='flex'>
                {players.map((player, index) => (
                    <div key={index} className={classNames(
                        turn === index ? 'animate-pulse' : '',
                        player.uid === props.user.uid ? 'bg-indigo-600' : 'bg-indigo-100',
                         '')}>{player.symbol}</div>
                        ))}
            </div>
        </div>
    )
}