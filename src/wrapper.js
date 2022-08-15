import React, { useEffect, useState } from 'react';
import { Game } from './game';
import { New } from './New';
import { Join } from './Join';
import { Exit } from './Exit';


export function Wrapper(props) {
    const [gameId, setGameId] = useState(null)
    useEffect(() => {
        if (gameId) {
            document.title = 'x: ' + gameId;
        } else {
            document.title = 'x';
        }
    });

    return (
        <div className='bg-black min-h-screen font-semibold text-indigo-400 p-10'>
                <div className='h-full flex flex-col flex-grow'>
                    <div className='flex-none'>
                        <h1 className="text-3xl font-bold underline decoration-wavy decoration-2 underline-offset-4 pb-2">x.tmos.es</h1>
                    </div>
                    {!gameId && <New user={props.user} setGameId={setGameId}/>}
                    {!gameId && <Join user={props.user} setGameId={setGameId}/>}
                    {gameId && <Game user={props.user} firestore={props.firestore} gameId={gameId} />}
                    {gameId && <Exit setGameId={setGameId} />}
                </div>
            </div>
    )
}