import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { socket } from '../socket/socket';

export default function HomePage() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('username', username);
    socket.auth = {
      username: localStorage.username,
    };

    socket.connect();
    // Emit 'join-room' event instead of 'player'
    socket.emit('join-room', username);
  }

  useEffect(() => {
    // Listen for when player joins a room
    socket.on('player-joined-room', (data) => {
      console.log('Player joined room:', data);
    });

    // Listen for when the game starts (when 2 players are in a room)
    socket.on('game-start', (data) => {
      console.log('Game starting with players:', data.players);
      setIsReady(true);
      setPlayers(data.players);
      
      navigate('/plays');
    });

    // Listen for connection errors
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.off('player-joined-room');
      socket.off('game-start');
      socket.off('connect_error');
    };

  }, []);

  useEffect(() => {
    console.log(players);
  });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold text-gray-200 text-center mb-6 font-mono">
        WELCOME, GAMER!
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Nama Pengguna"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-900 text-gray-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded"
        >
          ▶ START GAME
        </button>
      </form>
    </div>
  </div>
  );
}