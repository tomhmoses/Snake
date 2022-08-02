import React, { useState } from 'react';

export function Game(props) {
    const players = ['X','O']
    const [history, setHistory] = useState([[['','',''],['','',''],['','','']]])
    var turn = players[history.length % players.length]
    return (
        <div>
            <div>Noughts and Crosses</div>
            <div>{turn}'s Turn</div>
            <Board board={history.at(-1)}/>
        </div>
    )
}

function Board(props) {
    return (
        <div>
            {props.board.map((row, y) => (
                <Row row={row} y={y}/>
            ))}
        </div>
    )
}

function Row(props) {
    return (
        <div>
            {props.row.map((element, x) => (
                <Cell y={props.y} x={x} element={element}/>
            ))}
        </div>
    )
}

function Cell(props) {
    // passed current board state
    // passed an x and y
    return (
        <div>
            {props.element}
        </div>
    )
}