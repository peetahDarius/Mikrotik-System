import React, { useEffect, useState } from 'react';

const ErrorModal = ({ errorMessage, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // The modal will close in 3 seconds, so we increment the progress bar accordingly.
    const duration = 3000;
    const intervalTime = 50; // Update progress every 50ms

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (intervalTime / duration) * 100;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, intervalTime);

    // Set the timeout to close the modal after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Clean up the interval and timeout on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onClose]);

  if (!errorMessage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-1/3 mx-auto absolute top-0 transform transition-all duration-300 ease-in-out mt-4">
        {/* Error Message */}
        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Error</h2>
        <p className="text-gray-700 text-center mb-6">{errorMessage}</p>

        {/* Loader Line */}
        <div className="relative h-2 w-full bg-gray-200 rounded overflow-hidden">
          <div
            className="absolute h-full bg-red-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;