import React from 'react';

const LoseModal = ({ isOpen, onClose, onButtonClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Game Over</h2>
        <p className="text-gray-300 mb-6">You lost the game.</p>
        <div className="flex justify-end">
          <button
            onClick={() => {
              onButtonClick();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoseModal;