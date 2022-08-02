import React, { useState } from 'react';

export function Game(props) {
    const players = ['X','O']
    const [history, setHistory] = useState([[['','',''],['','',''],['','','']]])
    var turn = players[history.length % players.length]
    return (
        <div className='bg-black min-h-screen font-semibold text-indigo-400 p-10'>
            <h1 className="text-3xl font-bold underline pb-2">Noughts and Crosses</h1>
            <div>{turn}'s Turn</div>
            <Board board={history.at(-1)}/>
        </div>
    )
}

function Board(props) {
    return (
        <div className='flex border-2 w-min border-indigo-400'>
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
        <div className='border-indigo-100 border-2 h-10 w-10 text-center'>
            {props.element}
        </div>
    )
}