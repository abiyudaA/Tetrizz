import { useEffect, useState } from "react"
import Chatbox from "../components/Chatbox"
import User1 from "../components/User1"
import { useNavigate } from "react-router"
import { socket } from "../socket/socket"


export default function PlayGround() {
  const navigate = useNavigate()  
  const [players, setPlayers] = useState([])


  useEffect(() => {
    if (!localStorage.username) {
      navigate('/');
    }

    // Connect to the socket with the username
    socket.auth = { username: localStorage.username };
    socket.connect();

    // Listen for when player joins a room
    socket.on('player-joined-room', (data) => {
      console.log('Player joined room:', data);
      // You might want to store the room ID in state if needed
    });

    // Listen for when the game starts (when 2 players are in a room)
    socket.on('game-start', (data) => {
      console.log('Game starting with players:', data.players);
      setPlayers(data.players);

      // Only continue if we have 2 players
      if (data.players.length < 2) {
        navigate('/');
      }
    });

    // Listen for connection errors
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      navigate('/');
    });

    // Listen for disconnections
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('player-joined-room');
      socket.off('game-start');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(players);
  }, [players]);


  return (
    <div className="fixed container mx-auto p-4 h-screen bg-gray-900 text-gray-200 mt-16">
      <div className="bg-gray-800 rounded-lg shadow-md p-4">
        <User1 />
      </div>
      <Chatbox />
    </div>
  );
}