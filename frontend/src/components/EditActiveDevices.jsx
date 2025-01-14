import React, { useEffect, useState } from 'react';
import api from '../api';
import AuthorizeGuestModal from './AuthorizeGuestModal';

const EditActiveDevices = ({ closeEditActiveDevicesModal, device }) => {
    const [aps, setAps] = useState([]);
    const [loading, setLoading] = useState(null);
    const [showAuthorizeModal, setShowAuthorizeModal] = useState(false);

    useEffect(() => {
        fetchAPs();
    }, []);

    const fetchAPs = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/hotspot/access-points-mac/");
            setAps(response.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (actionType) => {
        if (actionType === 'authorize') {
            setShowAuthorizeModal(true);
        } else {
            try {
                let url = '';
                if (actionType === 'forget') {
                    url = '/api/hotspot/forget/';
                } else if (actionType === 'block') {
                    url = '/api/hotspot/block/';
                }

                const response = await api.post(url, { mac: device.mac});
                if (response.status === 200) {
                    closeEditActiveDevicesModal();
                }
            } catch (error) {
                console.error("An error occurred while processing the request: ", error);
            }
        }
    };
    const updateEmptyStringsToNull = (obj) => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[key] = value === "" ? null : value;
            return acc;
        }, {});
    };
    const handleAuthorize = async (data) => {
        const parsedData = updateEmptyStringsToNull(data)
        try {
            const response = await api.post('/api/hotspot/authorize/', { ...parsedData, mac: device.mac, ap_mac: device.ap_mac });
            if (response.status === 200) {
                closeEditActiveDevicesModal();
            }
        } catch (error) {
            console.error("An error occurred while processing the request: ", error);
        }
    };

    return (
        <div>
            {showAuthorizeModal && (
                <AuthorizeGuestModal 
                    onClose={() => setShowAuthorizeModal(false)}
                    onSubmit={handleAuthorize}
                />
            )}
            <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40 ${showAuthorizeModal ? 'blur-sm' : ''}`}>
                <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg z-30">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-indigo-700">Device Details</h2>
                        <button
                            onClick={closeEditActiveDevicesModal}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">ESSID:</span>
                                <span className="text-gray-900">{device.essid}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Access Point:</span>
                                <span className="text-gray-900">{aps.find((ap) => ap.mac === device.ap_mac)?.name || device.ap_mac}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Name:</span>
                                <span className="text-gray-900">{device.hostname}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Signal:</span>
                                <span className="text-gray-900">{device.signal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Noise:</span>
                                <span className="text-gray-900">{device.noise}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">MAC Address:</span>
                                <span className="text-gray-900">{device.mac}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">IP Address:</span>
                                <span className="text-gray-900">{device.ip}</span>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            {device.authorized ? (
                                <>
                                    <button
                                        onClick={() => handleAction('forget')}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Forget Guest
                                    </button>
                                    <button
                                        onClick={() => handleAction('block')}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Block Guest
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleAction('authorize')}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Authorize Guest
                                    </button>
                                    <button
                                        onClick={() => handleAction('block')}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Block Guest
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditActiveDevices;
