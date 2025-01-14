import React, { useState } from 'react';
import api from '../api';

const EditMpesaExpress = ({ closeEditMpesaExpressModal, data }) => {
    // State variables for the new fields
    const [accountReference, setAccountReference] = useState(data.account_reference || '');
    const [transactionType, setTransactionType] = useState(data.transaction_type || '');
    const [shortCode, setShortCode] = useState(data.short_code || '');
    const [callbackUrl, setCallbackUrl] = useState(data.callback_url || '');
    const [transactionDesc, setTransactionDesc] = useState(data.transaction_desc || '');
    const [partyB, setPartyB] = useState(data.party_b || '');
    const [consumerKey, setConsumerKey] = useState(data.consumer_key);
    const [consumerSecret, setConsumerSecret] = useState(data.consumer_secret);
    const [passKey, setPassKey] = useState(data.pass_key);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            account_reference: accountReference,
            transaction_type: transactionType,
            short_code: shortCode,
            callback_url: callbackUrl,
            transaction_desc: transactionDesc,
            party_b: partyB,
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            pass_key: passKey,
        };

        try {
            const response = await api.post('/api/hotspot/payment/credentials/', JSON.stringify(data));
            if (response.status === 201) {
                closeEditMpesaExpressModal();
            }
        } catch (error) {
            console.error("An error occurred while updating the credentials: ", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg h-full max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-center text-indigo-600">Edit Credentials</h2>
                    <button
                        onClick={closeEditMpesaExpressModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="account_reference" className="block text-sm font-medium text-gray-700">Account Reference</label>
                        <input
                            type="text"
                            id="account_reference"
                            value={accountReference}
                            onChange={(e) => setAccountReference(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                        <input
                            type="text"
                            id="transaction_type"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="short_code" className="block text-sm font-medium text-gray-700">Short Code</label>
                        <input
                            type="text"
                            id="short_code"
                            value={shortCode}
                            onChange={(e) => setShortCode(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="callback_url" className="block text-sm font-medium text-gray-700">Callback URL</label>
                        <input
                            type="text"
                            id="callback_url"
                            value={callbackUrl}
                            onChange={(e) => setCallbackUrl(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="transaction_desc" className="block text-sm font-medium text-gray-700">Transaction Description</label>
                        <input
                            type="text"
                            id="transaction_desc"
                            value={transactionDesc}
                            onChange={(e) => setTransactionDesc(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="party_b" className="block text-sm font-medium text-gray-700">Party B</label>
                        <input
                            type="text"
                            id="party_b"
                            value={partyB}
                            onChange={(e) => setPartyB(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="consumer_key" className="block text-sm font-medium text-gray-700">Consumer Key</label>
                        <input
                            type="text"
                            id="consumer_key"
                            value={consumerKey}
                            onChange={(e) => setConsumerKey(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="consumer_secret" className="block text-sm font-medium text-gray-700">Consumer Secret</label>
                        <input
                            type="text"
                            id="consumer_secret"
                            value={consumerSecret}
                            onChange={(e) => setConsumerSecret(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="pass_key" className="block text-sm font-medium text-gray-700">Pass Key</label>
                        <input
                            type="text"
                            id="pass_key"
                            value={passKey}
                            onChange={(e) => setPassKey(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditMpesaExpress;
