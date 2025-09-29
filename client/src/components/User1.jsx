import Tetris from "react-tetris";
import { socket } from "../socket/socket";
import { useEffect, useState } from "react";



function User1() {
    const [scores, setScores] = useState(0)
    const [lines, setLines] = useState(0)
    const [enemy, setEnemy] = useState('')
    const [enemyData, setEnemyData] = useState({
        points: 0,
        lines: 0
    })

    useEffect(() => {
        socket.auth = {
            username: localStorage.username
        }
        socket.connect()

        // Listen untuk data lawan
        socket.on("opponent-game-update", (data) => {
            setEnemyData({
                points: data.points,
                lines: data.lines
            })
            if (!enemy && data.username) {
                setEnemy(data.username)
            }
        })

        // Listen untuk info pemain baru
        socket.on('game-start', (data) => {
            const opponent = data.players.find(p => p.id !== socket.id)
            if (opponent) {
                setEnemy(opponent.username)
            }
        })

        return () => {
            socket.off('opponent-game-update');
            socket.off('game-start');
            socket.disconnect();
        };
    }, [])

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
                    // Kirim data game ke lawan setiap kali ada perubahan
                    socket.emit('game-update', { 
                        points: points, 
                        lines: linesCleared,
                        username: localStorage.username
                    })
                }, [points, linesCleared])

                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Enemy Points and Lines */}
                        <div className="md:col-span-1">
                            <div className="mb-4">
                                <p className="text-lg">the enemy's points</p>
                                <p className="text-2xl font-bold">{enemyData.points}</p>
                            </div>
                            <div>
                                <p className="text-lg">the enemy's lines</p>
                                <p className="text-2xl font-bold">{enemyData.lines}</p>
                            </div>
                            <div>
                                <p className="text-lg">Enemy:</p>
                                <p className="text-2xl font-bold">{enemy}</p>
                            </div>
                        </div>

                        {/* Sisanya sama seperti sebelumnya... */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="justify-self-center">
                                <div className="border border-gray-400 p-4 rounded h-auto w-100">
                                    <Gameboard />
                                </div>
                            </div>

                            <div className="justify-self-center">
                                <div className="border border-gray-400 p-2 rounded w-24">
                                    <PieceQueue />
                                </div>
                            </div>
                        </div>

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