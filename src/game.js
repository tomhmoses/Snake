import React, { useState } from 'react';

export function Game(props) {
    const players = ['X', 'O']
    const [history, setHistory] = useState([[['', '', ''], ['', '', ''], ['', '', '']]])

    // console.log(history)
    var lastboard = history.at(-1)
    var board = lastboard.map(function (arr) {
        return arr.slice();
    });
    var winner = checkForWinner(board)
    var turn = players[history.length % players.length]

    function pushToHistory(board) {
        setHistory([...history, [...board]])
    }

    function clickCell(x, y) {
        if (!winner) {
            var boardCopy = [...board]
            boardCopy[y][x] = turn
            pushToHistory(boardCopy)
        }
    }

    return (
        <div className='bg-black h-screen font-semibold text-indigo-400 p-10'>
            <div className='bg-green-100 h-full flex flex-col flex-grow'>
                <div className='flex-none'>
                    <h1 className="text-3xl font-bold underline pb-2">Noughts and Crosses</h1>
                    {!winner && <div>{turn}'s Turn</div>}
                    {winner && <div>{winner} Wins!</div>}
                </div>
                <Board board={board} clickCell={clickCell} />
                <div className='flex justify-around'>
                    <Reset setHistory={setHistory} />
                    <Undo history={history} setHistory={setHistory} />
                </div>
            </div>
        </div>
    )
}

function Reset(props) {
    var reset = () => {
        props.setHistory([[['', '', ''], ['', '', ''], ['', '', '']]])
    }
    return (
        <div onClick={reset}>Reset</div>
    )
}

function Undo(props) {
    var undo = () => {
        if (props.history.length > 1) {
            console.log(props.history)
            var historyCopy = [...props.history]
            console.log(historyCopy)
            historyCopy.pop()
            console.log(historyCopy)
            props.setHistory(historyCopy)
        }
    }
    return (
        <div onClick={undo}>Undo</div>
    )
}

function Board(props) {
    return (
        <div className='flex-grow border-2 border-indigo-400'>
            <div className='flex border-2 border-indigo-800'>
                <div className='flex flex-grow flex-col max-h-96 max-w-[24rem] max-w m-auto aspect-square border-2 border-green-600'>
                    {props.board.map((row, y) => (
                        <Row row={row} y={y} key={y} clickCell={props.clickCell} />
                    ))}
                </div>

            </div>
        </div>
    )
}

function Row(props) {
    return (
        <div className='flex h-10 flex-grow'>
            {props.row.map((element, x) => (
                <Cell element={element} x={x} key={x} y={props.y} clickCell={props.clickCell} />
            ))}
        </div>
    )
}


function Cell(props) {
    var clickThisCell = () => {
        if (!props.element) {
            props.clickCell(props.x, props.y)
        }
    }
    return (
        <div className={classNames(!props.element ? 'text-center cursor-pointer' : '', 'border-indigo-100 border-2 flex-grow w-10')} onClick={clickThisCell}>
            {props.element}
        </div>
    )


}

function checkForWinner(board) {
    // check horizontal
    const winAmount = 3;
    var currentPlayer = ''
    var currentRun = 0
    var x
    var y
    for (x = 0; x < board.length; x++) {
        currentPlayer = ''
        currentRun = 0
        for (y = 0; y < board.length; y++) {
            //check for continuation
            if (board[y][x] !== '' && board[y][x] === currentPlayer) {
                currentRun++
                if (currentRun === winAmount) {
                    // console.log('winner:')
                    // console.log(currentRun)
                    // console.log(currentPlayer)
                    return currentPlayer
                }
            } else {//switch to new player
                currentPlayer = board[y][x]
                currentRun = 1
            }
        }
    }
    // check vertical
    for (y = 0; y < board.length; y++) {
        currentPlayer = ''
        currentRun = 0
        for (x = 0; x < board.length; x++) {
            //check for continuation
            if (board[y][x] !== '' && board[y][x] === currentPlayer) {
                currentRun++
                if (currentRun === winAmount) {
                    return currentPlayer
                }
            } else {//switch to new player
                currentPlayer = board[y][x]
                currentRun = 1
            }
        }
    }
    // check diagonal down right
    // start bottom left... start only when length possible
    // move to top right... stop when length impossible
    var calcDiagLength = (i) => { //calculate length of each diagonal
        if (i < board.length) {
            return i + 1
        } else {
            return board.length * 2 - 1 - i
        }
    }
    var calcDiagStartCoords = (i) => { //returns {x: ?, y: ?}
        if (i < board.length) {
            return { x: 0, y: board.length - 1 - i }
        } else {
            return { x: i - board.length - 2, y: 0 }
        }
    }
    var i
    var n
    var diagStartCoords
    var diagLength
    for (i = winAmount - 1; i < (board.length * 2 - 1 - (winAmount - 1)); i++) { //each diagonal is numbered (starting with 0), heres where to start and end.
        currentPlayer = ''
        currentRun = 0
        diagStartCoords = calcDiagStartCoords(i)
        diagLength = calcDiagLength(i)
        for (n = 0; n < diagLength; n++) {
            console.log('-')
            console.log(diagStartCoords)
            console.log(n)
            //check for continuation
            x = diagStartCoords.x + n
            y = diagStartCoords.y + n
            if (board[y][x] !== '' && board[y][x] === currentPlayer) {
                currentRun++
                if (currentRun === winAmount) {
                    return currentPlayer
                }
            } else {//switch to new player
                currentPlayer = board[y][x]
                currentRun = 1
            }
        }
    }
    // check diagonal up right
    // start top left... 
    // end bottom right...
    var calcDiagUpStartCoords = (i) => { //returns {x: ?, y: ?}
        if (i < board.length) {
            return { x: 0, y: i }
        } else {
            return { x: i - board.length + 1, y: board.length - 1 }
        }
    }
    console.log('diag/..')
    for (i = winAmount - 1; i < (board.length * 2 - 1 - (winAmount - 1)); i++) { //each diagonal is numbered (starting with 0), heres where to start and end.
        currentPlayer = ''
        currentRun = 0
        diagStartCoords = calcDiagUpStartCoords(i)
        diagLength = calcDiagLength(i)
        for (n = 0; n < diagLength; n++) {
            console.log('-')
            console.log(diagStartCoords)
            console.log(n)
            //check for continuation
            x = diagStartCoords.x + n
            y = diagStartCoords.y - n
            if (board[y][x] !== '' && board[y][x] === currentPlayer) {
                currentRun++
                if (currentRun === winAmount) {
                    return currentPlayer
                }
            } else {//switch to new player
                currentPlayer = board[y][x]
                currentRun = 1
            }
        }
    }
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}