import { useEffect } from "react";
import Tetris from "react-tetris";

function User2() {

    useEffect(()=> {
        
    })
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {/* Points and Lines (Now within Tetris component) */}
            <Tetris
                keyboardControls={{
                    down: 'MOVE_DOWN',
                    left: 'MOVE_LEFT',
                    right: 'MOVE_RIGHT',
                    space: 'HARD_DROP',
                    z: 'FLIP_COUNTERCLOCKWISE',
                    x: 'FLIP_CLOCKWISE',
                    up: 'FLIP_CLOCKWISE',
                    p: 'TOGGLE_PAUSE',
                    c: 'HOLD',
                    shift: 'HOLD'
                }}
            >
                {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared, state, controller }) => (
                    <div className="col-span-3">
                        {/* Points and Lines */}
                        <div className="col-span-3 flex justify-around mb-4">
                            <div>
                                <p className="text-lg">points</p>
                                <p className="text-2xl font-bold">{points}</p>  {/* Access points from props */}
                            </div>
                            <div>
                                <p className="text-lg">lines</p>
                                <p className="text-2xl font-bold">{linesCleared}</p>  {/* Access linesCleared from props */}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="justify-self-start">
                                <div className="border border-gray-400 p-2 rounded">
                                    <HeldPiece />
                                </div>
                            </div>
                            <div className="justify-self-center">
                                <div className="border border-gray-400 p-2 rounded">
                                    <Gameboard />
                                </div>
                            </div>
                            <div className="justify-self-end">
                                <div className="border border-gray-400 p-2 rounded">
                                    <PieceQueue />
                                </div>
                            </div>
                        </div>

                        {/* Controls (Placeholder - Adjust as needed) */}
                        <div className="col-span-3 flex justify-center mt-8">
                            {/* ... (Your control layout using nested divs and buttons) ... */}
                        </div>

                        {/* Game Over Message */}
                        {state === 'LOST' && (
                            <div className="col-span-3 text-center mt-4">
                                <h2 className="text-xl font-bold mb-2">Game Over</h2>
                                <button
                                    onClick={controller.restart}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    New Game
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Tetris>
        </div>
    );
}



export default User2;