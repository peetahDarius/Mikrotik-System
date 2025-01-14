import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const DeleteDHCPServerModal = ({ closeDeleteDHCPServerModal, server }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const { handleError, ErrorModalComponent } = useErrorHandler();
    const handleDeleteClick = async () => {
        try {
          const response = await api.delete(`/api/dhcp/servers/${server.id}/`);
          if (response.status === 204){
            setShowSuccessModal(true);
          }
          
        } catch (error) {
            handleError(error);
        } finally {
          navigate('/dhcp/server');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeDeleteDHCPServerModal}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeDeleteDHCPServerModal}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Delete DHCP Server</h2>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-center">Are you sure you want to Delete this Server?</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={closeDeleteDHCPServerModal}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <SuccessModal
                isVisible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    closeDeleteDHCPServerModal();
                }}
                message="DHCP Server Deleted successfully!"
            />
            {ErrorModalComponent}
        </div>
    );
};

export default DeleteDHCPServerModal;
