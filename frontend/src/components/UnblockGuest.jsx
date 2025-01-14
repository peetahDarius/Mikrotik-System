import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import SuccessModal from './SuccessModal';

const UnblockGuest = ({ closeUnblockGuest }) => {
    const [macAddress, setMacAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleResolveClick = async () => {
        try {
            const response = await api.post(`/api/hotspot/unblock/`, {mac: macAddress});
            if (response.status === 200) {
                setShowSuccessModal(true);
            }
        } catch (error) {
            setErrorMessage("An error occurred while unblocking the MAC address.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeUnblockGuest}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeUnblockGuest}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Unblock Guest by MAC Address</h2>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">MAC Address</label>
                    <input
                        type="text"
                        value={macAddress}
                        onChange={(e) => setMacAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter MAC address (e.g., AA:BB:CC:DD:EE:FF)"
                    />
                </div>

                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleResolveClick}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                        Unblock
                    </button>
                    <button
                        onClick={closeUnblockGuest}
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
                    closeUnblockGuest();
                }}
                message="Guest unblocked successfully!"
            />
        </div>
    );
};

export default UnblockGuest;
