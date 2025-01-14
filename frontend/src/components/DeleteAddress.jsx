import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const DeleteAddressModal = ({ closeDeleteAddressModal, address }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const { handleError, ErrorModalComponent } = useErrorHandler();
    const handleDeleteClick = async () => {
        try {
          await api.delete(`/api/ip/addresses/${address.id}/`);
          setShowSuccessModal(true);
        } catch (error) {
            handleError(error);
        } finally {
          navigate('/addresses');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeDeleteAddressModal}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeDeleteAddressModal}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Delete Address</h2>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-center">Are you sure you want to Delete this Address?</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={closeDeleteAddressModal}
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
                    closeDeleteAddressModal();
                }}
                message="Address Deleted successfully!"
            />
            {ErrorModalComponent}
        </div>
    );
};

export default DeleteAddressModal;
