import React, { useState } from 'react';
import api from '../api';

const CreateMpesaExpress = ({ closeCreateMpesaExpressModal }) => {
  const [accountReference, setAccountReference] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');
  const [partyB, setPartyB] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [passKey, setPassKey] = useState('');

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
        closeCreateMpesaExpressModal();
      }
    } catch (error) {
      console.error("An error occurred while updating the credentials: ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Create Mpesa Express</h2>
          <button
            onClick={closeCreateMpesaExpressModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accountReference" className="block text-sm font-medium text-gray-700">Account Reference</label>
            <input
              type="text"
              id="accountReference"
              value={accountReference}
              onChange={(e) => setAccountReference(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <input
              type="text"
              id="transactionType"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700">Short Code</label>
            <input
              type="text"
              id="shortCode"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="callbackUrl" className="block text-sm font-medium text-gray-700">Callback URL</label>
            <input
              type="url"
              id="callbackUrl"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="transactionDesc" className="block text-sm font-medium text-gray-700">Transaction Description</label>
            <input
              type="text"
              id="transactionDesc"
              value={transactionDesc}
              onChange={(e) => setTransactionDesc(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="partyB" className="block text-sm font-medium text-gray-700">Party B</label>
            <input
              type="text"
              id="partyB"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700">Consumer Key</label>
            <input
              type="text"
              id="consumerKey"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700">Consumer Secret</label>
            <input
              type="text"
              id="consumerSecret"
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="passKey" className="block text-sm font-medium text-gray-700">Pass Key</label>
            <input
              type="text"
              id="passKey"
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
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMpesaExpress;
