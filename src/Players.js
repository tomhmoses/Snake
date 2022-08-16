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
        return first.playerNum - second.playerNum;
    });
    var turn = props.turn % players.length;
    var currentPlayer = players[turn];
    
    return (
        <div className='flex-col justify-center p-4'>
            <div className='flex justify-center'>
                {players.map((player, index) => (
                    <div key={index} className={classNames(
                        turn === index ? 'underline' : '',
                        player.uid === props.user.uid ? '' : '',
                         ' text-2xl p-1')}>{player.symbol}</div>
                        ))}
            </div>
            <div className='flex justify-center p-1'>You are: {props.players[props.user.uid].symbol}</div>
            {props.myTurn && <div className='flex justify-center p-1'>Your turn</div>}
            {props.started && !props.winner && !props.myTurn && <div className='flex justify-center p-1'>{currentPlayer.symbol}'s turn</div>}
            {props.winner && <div className='flex justify-center p-1'>🎉 {props.winner} wins! 🎉</div>}
            {props.draw && <div className='flex justify-center p-1'>It's a draw!</div>}
            {!props.started && <div className='flex justify-center p-1'>Wait for the other players to join, then click Start to begin the game.</div>}
        </div>
    )
}