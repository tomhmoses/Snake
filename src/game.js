import React, { useState } from 'react';

export function Game(props) {
    const players = ['X','O']
    const [turn, setTurn] = useState(players[0])
    const [board, setBoard] = useState([['','',''],['','',''],['','','']])
    return (
        <div>
            <div>Noughts and Crosses</div>
            <div>{turn}'s Turn</div>
        </div>
    )
}
