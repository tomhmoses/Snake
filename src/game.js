import React from 'react';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firehooks/firestore';

export function Game(props) {
    const gameRef = doc(props.firestore, "games", props.gameId);
    const [gameData, loading, error] = useDocumentData(gameRef);

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
        var winner = gameData.winner
        var turn = gameData.turn

        function clickCell(x, y) {
            if (!winner) {
                console.log('TODO: clickCell')
            }
        }

        return (
            <div>
                {!winner && <div>{turn}'s Turn</div>}
                {winner && <div>{winner} Wins!</div>}
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
        <div className={classNames(!props.element ? 'text-center cursor-pointer' : '', 'border-indigo-100 border-2 flex flex-grow w-10 text-2xl text-center content-center flex-col')} onClick={clickThisCell}>
            <div className='flex flex-grow'></div>
            <div className=''>{props.element}</div>
            <div className='flex flex-grow'></div>
        </div>
    )
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}