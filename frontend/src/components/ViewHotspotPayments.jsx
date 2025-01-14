import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../api';

const ViewHotspotPayments = ({ closeViewHotspotPayments }) => {
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const [payments, setPayments] = useState([]);
    const [showPaymentsTable, setShowPaymentsTable] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchPayments = async () => {
        try {
            const response = await api.get(`/api/hotspot/payment/`, {
                params: { time_from: timeFrom, time_to: timeTo },
            });
            if (response.status === 200) {
                setPayments(response.data); // Assuming response.data is an array of payments
                setShowPaymentsTable(true);
                setError(null);
            }
        } catch (error) {
            setError('Failed to fetch payments. Please try again.');
            setPayments([]);
            setShowPaymentsTable(false);
        }
    };

    return (
        <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeViewHotspotPayments}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeViewHotspotPayments}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">View Hotspot Payments</h2>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Time From</label>
                    <input
                        type="datetime-local"
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Time To</label>
                    <input
                        type="datetime-local"
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleFetchPayments}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                        Fetch Payments
                    </button>
                    <button
                        onClick={closeViewHotspotPayments}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>

                {error && (
                    <div className="mt-4 text-red-500 text-center">
                        {error}
                    </div>
                )}

                {showPaymentsTable && (
                    <div className="mt-6 max-h-96 overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Phone Number</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Receipt</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Amount</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((payment, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100">
                                            <td className="py-2 px-4">{payment.phone_number}</td>
                                            <td className="py-2 px-4">{payment.receipt_number}</td>
                                            <td className="py-2 px-4">{payment.amount}</td>
                                            <td className="py-2 px-4">{new Date(payment.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-2 px-4 text-center">No payments found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewHotspotPayments;
