import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const ChangePPPUsernameModal = ({ closeChangePPPUsernameModal, serviceID, username}) => {
  const [newUsername, setNewUsername] = useState(username);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();
  const handleSaveClick = async () => {
    const data = { username: newUsername };
    try {
        
      const response = await api.patch(`/api/clients/ppp/${serviceID}/`, JSON.stringify(data));

      console.log("data: ", response.data, "status", response.status);        
      setShowSuccessModal(true);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeChangePPPUsernameModal}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faTimes}
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
            onClick={closeChangePPPUsernameModal}
            title="Close"
          />
          <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Change Username</h2>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter your new Username..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Save
          </button>
          <button
            onClick={closeChangePPPUsernameModal}
            className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          isVisible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            closeChangePPPUsernameModal();
          }}
          message="Username changed successfully!"
        />
      )}
      {ErrorModalComponent}
    </div>
  );
};

export default ChangePPPUsernameModal;
