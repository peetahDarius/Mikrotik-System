import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const SuccessModal = ({ isVisible, onClose, message }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isVisible, onClose]);

  return (
    isVisible ? (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg flex flex-col items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-3" />
          <p className="text-gray-800">{message}</p>
        </div>
      </div>
    ) : null
  );
};

export default SuccessModal;
