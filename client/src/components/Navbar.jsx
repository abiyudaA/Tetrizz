
import { useNavigate } from 'react-router';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <nav className="z-10 bg-gray-800 fixed top-0 w-full p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <span className="text-gray-200 font-bold text-xl font-mono">
          TEZTRIZ
        </span>
      </div>
      <div className="flex items-center">
        <button
          className="bg-red-700 hover:bg-red-600 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
