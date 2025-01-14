import React, { useState } from 'react';

const AuthorizeGuestModal = ({ onClose, onSubmit }) => {
    const [mbytes, setMbytes] = useState('');
    const [minutes, setMinutes] = useState('');
    const [up, setUp] = useState('');
    const [down, setDown] = useState('');

    const handleSubmit = () => {
        if (up === '' || down === '') {
            alert('Both upload and download speeds are required.');
            return;
        }
        onSubmit({ mbytes, minutes, up, down });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-indigo-700">Authorize Guest</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">MB Bytes:</label>
                        <input
                            type="number"
                            placeholder="Optional"
                            value={mbytes}
                            onChange={(e) => setMbytes(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Minutes:</label>
                        <input
                            type="number"
                            placeholder="Optional"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Speed (Kbps):</label>
                        <input
                            type="number"
                            required
                            value={up}
                            onChange={(e) => setUp(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Download Speed (Kbps):</label>
                        <input
                            type="number"
                            required
                            value={down}
                            onChange={(e) => setDown(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Authorize
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorizeGuestModal;
