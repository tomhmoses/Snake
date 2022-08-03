import React, { useState } from 'react';

export function Game(props) {
    const players = ['X','O']
    const [history, setHistory] = useState([[['','',''],['','',''],['','','']]])
    const [winner, setWinner] = useState('')
    console.log(history)
    var board=history.at(-1)
    var turn = players[history.length % players.length]

    function pushToHistory(board) {
        setHistory([...history, board ])
    }

    function clickCell(x, y) {
        if (!winner) {
            var boardCopy = [...board]
            boardCopy[y][x] = turn
            pushToHistory(boardCopy)
        }
    }

    if (!winner) {
        checkForWinner(board, setWinner)
    }

    return (
        <div className='bg-black min-h-screen font-semibold text-indigo-400 p-10'>
            <h1 className="text-3xl font-bold underline pb-2">Noughts and Crosses</h1>
            {!winner && <div>{turn}'s Turn</div>}
            {winner && <div>{winner} Wins!</div>}
            <Board board={board} clickCell={clickCell}/>
            <Reset setHistory={setHistory} setWinner={setWinner}/>
        </div>
    )
}

function Reset(props) {
    var reset = () => {
        props.setHistory([[['','',''],['','',''],['','','']]])
        props.setWinner('')
    }
    return (
        <div onClick={reset}>Reset</div>
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

function checkForWinner(board, setWinner) {
    // check horizontal
    const winAmount = 3;
    var currentPlayer = ''
    var currentRun = 0
    for (var x = 0; x < board.length; x++) {
        currentPlayer = ''
        currentRun = 0
        for (var y = 0; y < board.length; y++) {
            //check for continuation
            if (board[y][x] !== '' && board[y][x] === currentPlayer) {
                currentRun++
                if (currentRun === winAmount) {
                    console.log('winner:')
                    console.log(currentRun)
                    console.log(currentPlayer)
                    setWinner(currentPlayer)
                }
            } else {//switch to new player
                currentPlayer = board[y][x]
                currentRun = 1
            }
        }
    }
    // check vertical
    for (var y = 0; y < board.length; y++) {
        currentPlayer = ''
        currentRun = 0
        for (var x = 0; x < board.length; x++) {
            //check for continuation
            if (board[y][x] !== '' && board[y][x] === currentPlayer) {
                currentRun++
                if (currentRun === winAmount) {
                    setWinner(currentPlayer)
                }
            } else {//switch to new player
                currentPlayer = board[y][x]
                currentRun = 1
            }
        }
    }
    // check diagonal
}