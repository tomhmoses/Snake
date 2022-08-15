import React, { useState } from 'react';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firehooks/firestore';
import { Start } from './Start';
import { Players } from './Players';

export function Game(props) {
    const gameRef = doc(props.firestore, "games", props.gameId);
    const [gameData, loading, error] = useDocumentData(gameRef);
    const [usingLocalBoard, setUsingLocalBoard] = useState(false);
    const [localBoard, setLocalBoard] = useState(null);

    console.log(gameData)

    if (gameData) {
        // const players = gameData.players
        // const boardLength = gameData.size
        var board = []
        for (let i = 0; i < gameData.size; i++) {
            board.push(gameData.board[i].split("").map(
                (element) => {
                    return element === "_" ? "" : element
                }
            ));
        }
        var started = gameData.started
        var winner = gameData.winner
        var turn = gameData.turn
        var players = gameData.players
        var numOfplayers = Object.keys(players).length
        let myTurn = false;
        if (started && !winner && (turn % numOfplayers === players[props.user.uid].playerNum)) {
            myTurn = true;
        }

        const tempSetBoardLocation = (x, y, element) => {
            board[y][x] = element;
            setLocalBoard(board);
            setUsingLocalBoard(true);
        }

        function clickCell(x, y) {
            console.log('myTurn', myTurn)
            if (myTurn) {
                tempSetBoardLocation(x, y, players[props.user.uid].symbol);
                console.log('temparily changed local board')
                var url = new URL("https://x.tmos.es/api/playTurn"),
                    params = { idToken: props.user.accessToken, gameId: props.gameId, x: x, y: y }
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
                fetch(url)
                    .then(response => response.json())
                    .then((response) => {
                        setUsingLocalBoard(false);
                        // could we temporarily set the game to be what we think it will be?
                        console.log('response:', response);
                    })
                    .catch(err => console.log(err))
                    .finally(() => {setUsingLocalBoard(false);})
            }
        }

        if (usingLocalBoard) {
            board = localBoard;
            turn += 1;
        }


        return (
            <div>
                <p className='font-semibold'>Game: {props.gameId}</p>
                <Players turn={turn} players={players} winner={winner} user={props.user} myTurn={myTurn} started={started} />
                {!started && <Start gameId={props.gameId} user={props.user} />}
                <Board board={board} clickCell={clickCell} />
            </div>
        )
    } else if (loading) {
        console.log(loading)
        return <div>{loading}</div>
    } else if (error) {
        console.log(error)
        return <div>{error}</div>
    } else {
        return <div>Loading</div>
    }
}

function Board(props) {
    return (
        <div className='flex-grow'>
            <div className='flex  h-full'>
                <div className='flex flex-grow'></div>
                <div className='flex flex-grow flex-col max-h-96 max-w-[24rem] max-w m-auto aspect-square border-8 rounded-lg border-indigo-600'>
                    {props.board.map((row, y) => (
                        <Row row={row} y={y} key={y} clickCell={props.clickCell} />
                    ))}
                </div>
                <div className='flex flex-grow'></div>
            </div>
        </div>
    )
}

function Row(props) {
    return (
        <div className='flex min-h-10 flex-grow'>
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
        <div className={classNames(!props.element ? 'text-center cursor-pointer' : '', 'border-indigo-100 border-[1px] flex flex-grow w-10 text-2xl text-center content-center flex-col')} onClick={clickThisCell}>
            <div className='flex flex-grow'></div>
            <div className=''>{props.element}</div>
            <div className='flex flex-grow'></div>
        </div>
    )
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}