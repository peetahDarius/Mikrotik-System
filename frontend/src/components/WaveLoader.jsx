import React from 'react';

const WaveLoader = () => {
  return (
    <>
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(2);
          }
        }

        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }

        .wave-delay-1 {
          animation-delay: 0.1s;
        }
        
        .wave-delay-2 {
          animation-delay: 0.2s;
        }

        .wave-delay-3 {
          animation-delay: 0.3s;
        }

        .wave-delay-4 {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center h-screen">
        {/* Loader bars */}
        <div className="flex space-x-2 mb-4">
          <div className="h-10 w-1 bg-blue-500 animate-wave"></div>
          <div className="h-10 w-1 bg-blue-500 animate-wave wave-delay-1"></div>
          <div className="h-10 w-1 bg-blue-500 animate-wave wave-delay-2"></div>
          <div className="h-10 w-1 bg-blue-500 animate-wave wave-delay-3"></div>
          <div className="h-10 w-1 bg-blue-500 animate-wave wave-delay-4"></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-700 text-lg font-semibold"></p>
      </div>
    </>
  );
};

export default WaveLoader;