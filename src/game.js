import React, { useState } from 'react';

export function Game(props) {
    const players = ['X','O']
    const [history, setHistory] = useState([[['','',''],['','',''],['','','']]])
    console.log(history)
    var board=history.at(-1)
    var turn = players[history.length % players.length]

    function pushToHistory(board) {
        setHistory([...history, board ])
    }

    function clickCell(x, y) {
            var boardCopy = [...board]
            boardCopy[y][x] = turn
            pushToHistory(boardCopy)
    }

    return (
        <div className='bg-black min-h-screen font-semibold text-indigo-400 p-10'>
            <h1 className="text-3xl font-bold underline pb-2">Noughts and Crosses</h1>
            <div>{turn}'s Turn</div>
            <Board board={board} clickCell={clickCell}/>
        </div>
    )
}

function Board(props) {
    return (
        <div className='flex border-2 w-min border-indigo-400'>
            {props.board.map((row, y) => (
                <Row row={row} y={y} clickCell={props.clickCell}/>
            ))}
        </div>
    )
}

function Row(props) {
    return (
        <div>
            {props.row.map((element, x) => (
                <Cell element={element} x={x} y={props.y} clickCell={props.clickCell}/>
            ))}
        </div>
    )
}



function Cell(props) {
    if (props.element) {
        return (
            <div className='border-indigo-100 border-2 h-10 w-10 text-center'>
                {props.element}
            </div>
        )
    } else {
        var clickThisCell = () => {
            props.clickCell(props.x,props.y)
        }
        return (
            <div className='border-indigo-100 border-2 h-10 w-10 text-center cursor-pointer' onClick={clickThisCell}>
                {props.element}
            </div>
        )
    }
    
}