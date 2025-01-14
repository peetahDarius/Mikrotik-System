import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useErrorHandler from '../components/useErrorHandler.';

const PaymentConfig = () => {
  // State variables to hold input values
  const [shortCode, setShortCode] = useState('');
  const [accNoPrefix, setAccNoPrefix] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [confirmationUrl, setConfirmationUrl] = useState('');
  const [validationUrl, setValidationUrl] = useState('');
  const { handleError, ErrorModalComponent } = useErrorHandler();

  // Visibility toggle state
  const [keyVisible, setKeyVisible] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);

  // Function to toggle visibility for the Consumer Key
  const toggleKeyVisibility = () => {
    setKeyVisible(!keyVisible);
  };

  // Function to toggle visibility for the Consumer Secret
  const toggleSecretVisibility = () => {
    setSecretVisible(!secretVisible);
  };

  // Fetch current values
  const fetchCurrentValues = async () => {
    try {
      const response = await api.get('/api/payments/credentials/');
      const data = response.data[0];

      setShortCode(data.short_code);
      setAccNoPrefix(data.acc_no_prefix);
      setConsumerKey(data.consumer_key);
      setConsumerSecret(data.consumer_secret);
      setConfirmationUrl(data.confirmation_url);
      setValidationUrl(data.validation_url);
    } catch (error) {
      handleError(error);    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const configData = {
      short_code: shortCode,
      acc_no_prefix: accNoPrefix,
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      confirmation_url: confirmationUrl,
      validation_url: validationUrl,
    };

    try {
      await api.post('/api/payments/credentials/', configData);
      alert('Payment configuration updated successfully!');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchCurrentValues();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-6">M-Pesa Configuration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Short Code:</label>
          <input
            type="text"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Number Prefix:</label>
          <input
            type="text"
            value={accNoPrefix}
            onChange={(e) => setAccNoPrefix(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Consumer Key:</label>
          <input
            type={keyVisible ? "text" : "password"}
            value={consumerKey}
            onChange={(e) => setConsumerKey(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded pr-10"
          />
          <button
            type="button"
            onClick={toggleKeyVisibility}
            className="absolute inset-y-0 mt-6 right-0 flex items-center px-3"
          >
            {keyVisible ? (
              <FaEyeSlash className="text-gray-500" />
            ) : (
              <FaEye className="text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Consumer Secret:</label>
          <input
            type={secretVisible ? "text" : "password"}
            value={consumerSecret}
            onChange={(e) => setConsumerSecret(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded pr-10"
          />
          <button
            type="button"
            onClick={toggleSecretVisibility}
            className="absolute inset-y-0 right-0 flex mt-6 items-center px-3"
          >
            {secretVisible ? (
              <FaEyeSlash className="text-gray-500" />
            ) : (
              <FaEye className="text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Confirmation URL:</label>
          <input
            type="text"
            value={confirmationUrl}
            onChange={(e) => setConfirmationUrl(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Validation URL:</label>
          <input
            type="text"
            value={validationUrl}
            onChange={(e) => setValidationUrl(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
        >
          Save Configuration
        </button>
      </form>
      {ErrorModalComponent}
    </div>
  );
};

export default PaymentConfig;
