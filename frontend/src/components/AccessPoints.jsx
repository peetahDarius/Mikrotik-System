import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import api from '../api';
import WaveLoader from '../components/WaveLoader';

const AccessPoints = () => {
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null)

    useEffect(() => {  
      fetchAPs()
    }, []);

    const fetchAPs = async () => {
      setLoading(true)
      try {
          const response = await api.get("api/hotspot/access-points/")
          setDevices(response.data)
      } catch (error) {
          
      } finally {
          setLoading(false)
      }
  }
 
  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hotspot/Access points</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mac</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Adopted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices.map((device, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.mac}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{String(device.adopted)}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessPoints;
