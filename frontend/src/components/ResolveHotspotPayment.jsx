import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../api';


const ResolvePayment = ({ closeResolvePayment }) => {
    const [paymentCode, setPaymentCode] = useState('');
    const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
    const [showPaymentNotFoundModal, setShowPaymentNotFoundModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);

    const handleResolveClick = async () => {
        try {
            const response = await api.get(`/api/hotspot/payment/${paymentCode}/`);
            if (response.status === 200) {
                setPaymentDetails({
                    receipt_number: response.data.receipt,
                    amount: response.data.amount,
                    time: response.data.created_at,
                });
                setShowPaymentDetailsModal(true);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setShowPaymentNotFoundModal(true)
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeResolvePayment}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeResolvePayment}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Resolve Payment</h2>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Payment Code</label>
                    <input
                        type="text"
                        value={paymentCode}
                        onChange={(e) => setPaymentCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter payment code"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleResolveClick}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                        Resolve
                    </button>
                    <button
                        onClick={closeResolvePayment}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            {showPaymentDetailsModal && (
                <PaymentDetailsModal
                    isVisible={showPaymentDetailsModal}
                    onClose={() => {
                        setShowPaymentDetailsModal(false);
                        closeResolvePayment();
                    }}
                    paymentDetails={paymentDetails}
                />
            )}
            {showPaymentNotFoundModal && (
                <PaymentNotFoundModal
                    isVisible={showPaymentNotFoundModal}
                    onClose={() => {
                        setShowPaymentNotFoundModal(false);
                        closeResolvePayment();
                    }}
                />
            )}
        </div>
    );
};

export default ResolvePayment;


const PaymentDetailsModal = ({ isVisible, onClose, paymentDetails }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center mt-10">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-4 transform transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-blue-900">Payment Details</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={onClose}
                        title="Close"
                    />
                </div>
                <div className="mb-2">
                    <p className="text-gray-700"><strong>Receipt Number:</strong> {paymentDetails.receipt_number}</p>
                </div>
                <div className="mb-2">
                    <p className="text-gray-700"><strong>Amount:</strong> {paymentDetails.amount}</p>
                </div>
                <div className="mb-2">
                    <p className="text-gray-700"><strong>Time:</strong> {new Date(paymentDetails.time).toLocaleString()}</p>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const PaymentNotFoundModal = ({ isVisible, onClose}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center mt-10">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-4 transform transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-blue-900">Payment Details</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={onClose}
                        title="Close"
                    />
                </div>
                <p> Payment not found!</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

