import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const DepositCash = ({ closeDepositCash, clientID }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { handleError, ErrorModalComponent } = useErrorHandler();

    const handleDepositClick = async () => {
        // Prepare data to send to the backend
        const data = {
            client: clientID,
            amount: parseFloat(amount),
            description,
        };
        console.log(clientID)

        try {
            const response = await api.post('/api/payments/create/', JSON.stringify(data));
            if (response.status === 201) {
                setShowSuccessModal(true);
            }
        } catch (error) {
            handleError(error);        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeDepositCash}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeDepositCash}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Deposit Cash</h2>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter amount"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter description"
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleDepositClick}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                        Deposit
                    </button>
                    <button
                        onClick={closeDepositCash}
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
                        closeDepositCash();
                    }}
                    message="Cash deposited successfully!"
                />
            )}
            {ErrorModalComponent}
        </div>
    );
};

export default DepositCash;
