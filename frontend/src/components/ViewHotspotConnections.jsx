import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../api';

const ViewHotspotConnections = ({ closeViewHotspotConnections, timeFrom, timeTo, accessPoint }) => {
    const [connections, setConnections] = useState([]);
    const [showConnectionsTable, setShowConnectionsTable] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (timeFrom && timeTo) {
            handleFetchConnections();
        }
    }, [timeFrom, timeTo]);

    const handleFetchConnections = async () => {
        try {
            const response = await api.post(`/api/hotspot/report/connections/specific/`, {time_from: timeFrom, time_to: timeTo, access_point: accessPoint});
            if (response.status === 200) {
                setConnections(response.data); 
                setShowConnectionsTable(true);
                setError(null);
            }
        } catch (error) {
            setError('Failed to fetch Connections. Please try again.');
            setConnections([]);
            setShowConnectionsTable(false);
        }
    };

    return (
        <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeViewHotspotConnections}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeViewHotspotConnections}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">View Hotspot Connections</h2>
                </div>

                {error && <p className="text-red-600">{error}</p>}

                {/* Display connections table here */}
                {showConnectionsTable && (
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table headers */}
                        <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Phone Number</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Package</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">MAC</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">UP</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Down</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Byte Quota</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Price</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Time</th>
                                </tr>
                            </thead>
                        <tbody>
                            {connections.map((connection, index) => (
                                <tr key={index}>
                                    {/* Render connection data */}
                                    <td className="py-2 px-4">{connection.phone}</td>
                                    <td className="py-2 px-4">{connection.package}</td>
                                    <td className="py-2 px-4">{connection.mac}</td>
                                    <td className="py-2 px-4">{connection.up}</td>
                                    <td className="py-2 px-4">{connection.down}</td>
                                    <td className="py-2 px-4">{connection.byte_quota}</td>
                                    <td className="py-2 px-4">{connection.price}</td>
                                    <td className="py-2 px-4">{new Date(connection.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewHotspotConnections;
