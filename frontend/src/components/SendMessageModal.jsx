import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from '../components/SuccessModal';
import api from "../api"
import useErrorHandler from "./useErrorHandler.";

const SendMessageModal = ({ closeSendMessageModal, phoneNumber }) => {
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  const handleSendClick = async () => {
    const mobile_list = Array.isArray(phoneNumber) ? phoneNumber : [phoneNumber];

    const data = {
      numbers: mobile_list,
      message: message
    }
    try {
      const response = await api.post("/api/send-sms/", JSON.stringify(data))

      if (response.status === 200) {
        setShowSuccessModal(true);
      }   
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeSendMessageModal}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faTimes}
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
            onClick={closeSendMessageModal}
            title="Close"
          />
          <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Send Message</h2>
        </div>
        <div className="mb-4">
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Type your message here..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSendClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Send
          </button>
          <button
            onClick={closeSendMessageModal}
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
          closeSendMessageModal();
        }}
        message="Message sent successfully!"
      />
      {ErrorModalComponent}
    </div>
  );
};

export default SendMessageModal;
