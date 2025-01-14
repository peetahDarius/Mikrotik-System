import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const ActivatePPPClientModal = ({ closeActivatePPPClientModal, serviceID }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { handleError, ErrorModalComponent } = useErrorHandler();
    const handleActivateClick = async () => {
        try {
            const res = await api.patch(`/api/clients/ppp/client/activate/${serviceID}/`);
            if (res.status === 200 ) {
                setShowSuccessModal(true);
            }
            
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeActivatePPPClientModal}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeActivatePPPClientModal}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Activate service</h2>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-center">Are you sure you want to Activate this service?</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleActivateClick}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={closeActivatePPPClientModal}
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
                    closeActivatePPPClientModal();
                }}
                message="Service Activated successfully!"
            />
            {ErrorModalComponent}
        </div>
    );
};

export default ActivatePPPClientModal;
