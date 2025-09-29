import Tetris from "react-tetris";
import { socket } from "../socket/socket";
import { useEffect, useState } from "react";



function User1() {

    const [scores, setScores] = useState(0)
    const [lines, setLines] = useState(0)
    const [enemy, setEnemy] = useState('')
    const [opponent, setOpponent] = useState({
        from: '',
        data: {
            points: 0,
            lines: 0
        }
    })

    useEffect(() => {
        socket.auth = {
            username: localStorage.username
        }
        socket.connect()

        socket.on("opponents:update", (data) => {
            setOpponent(data)
        })

        socket.on('newPlayer', (data) => {
            setEnemy(data.opponent)
            // console.log(data, 'name');

        })

        return () => {
            socket.off('newPlayer');
            socket.disconnect();
        };
    }, [])

    useEffect(() => {
        console.log(opponent);
        // setScores(po)
    })

    return (
        <Tetris
            keyboardControls={{
                down: "MOVE_DOWN",
                left: "MOVE_LEFT",
                right: "MOVE_RIGHT",
                space: "HARD_DROP",
                z: "FLIP_COUNTERCLOCKWISE",
                x: "FLIP_CLOCKWISE",
                up: "FLIP_CLOCKWISE",
                p: "TOGGLE_PAUSE",
                c: "HOLD",
                shift: "HOLD",
            }}
        >
            {({
                Gameboard,
                PieceQueue,
                points,
                linesCleared,
                state,
                controller,
            }) => {
                useEffect(() => {
                    socket.auth = {
                        username: localStorage.username
                    }
                    socket.connect()

                    setScores(points)
                    setLines(linesCleared)


                    socket.emit('opponent:data', { points: scores, lines })


                    return () => {
                        socket.disconnect();
                    };
                }, [points, linesCleared])
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Enemy Points and Lines (Left Side - Medium Size) */}
                        <div className="md:col-span-1">
                            <div className="mb-4">
                                <p className="text-lg">the enemy's points</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <div>
                                <p className="text-lg">the enemy's lines</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <div>
                                <p className="text-lg">{enemy}</p>
                                <p className="text-2xl font-bold">{enemy}</p>
                            </div>
                        </div>

                        {/* Gameboard (Large) and User Points/Lines (Top) and Piece Queue (Right - Slim) */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* User Points/Lines (Top of Gameboard) */}
                            <div className="md:col-span-2 mb-4 flex justify-around">
                                <div>
                                    <p className="text-lg">points</p>
                                    <p className="text-2xl font-bold">{points}</p>
                                </div>
                                <div>
                                    <p className="text-lg">lines</p>
                                    <p className="text-2xl font-bold">{linesCleared}</p>
                                </div>
                            </div>

                            {/* Gameboard (Large) */}
                            <div className="justify-self-center">
                                <div className="border border-gray-400 p-4 rounded h-auto w-100"> {/* Increased padding */}
                                    <Gameboard /> {/* Increased scale */}
                                </div>
                            </div>

                            {/* Piece Queue (Right - Slim) */}
                            <div className="justify-self-center">
                                <div className="border border-gray-400 p-2 rounded w-24"> {/* Reduced width */}
                                    <PieceQueue /> {/* Reduced scale */}
                                </div>
                            </div>
                        </div>

                        {/* Controls (Placeholder) */}
                        <div className="md:col-span-3 flex justify-center mt-8">
                            {/* ... (Your control layout using nested divs and buttons) ... */}
                        </div>

                        {/* Game Over Message */}
                        {state === "LOST" && (
                            <div className="md:col-span-3 text-center mt-4">
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
                )
            }}
        </Tetris>
    );
}

export default User1;