import React, { useEffect, useState } from 'react';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from './WaveLoader';

const EditDHCPServer = ({ closeEditDHCPServerModal, server }) => {
    const [name, setName] = useState(server.name);
    const [selectedPool, setSelectedPool] = useState(server.pool);
    const [loading, setLoading] = useState(true);
    const [ipPools, setIpPools] = useState([]);
    const [selectedInterface, setSelectedInterface] = useState(server.interface);
    const [interfaces, setInterfaces] = useState([]);
    const [relay, setRelay] = useState(server.relay)
    const { handleError, ErrorModalComponent } = useErrorHandler();

    useEffect(() => {
        fetchInterfaces();
        fetchPools();
      }, []);
    
      const fetchInterfaces = async () => {
        setLoading(true);
        try {
          const response = await api.get("api/interfaces/");
          const apiInterfaces = response.data
            .filter((singleInterface) => singleInterface["name"])
            .map((singleInterface) => singleInterface["name"]);
          setInterfaces(apiInterfaces);
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
        }
      };
      const fetchPools = async () => {
        try {
          const response = await api.get("api/pool/");
          if (response.status === 200) {
            setIpPools(response.data);
          }
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
        }
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
        name: name,
        pool: selectedPool,
        relay: relay,
        interface: selectedInterface
      };

    try {
      const response = await api.put(`/api/dhcp/servers/${server.id}/`, JSON.stringify(data));
      if (response.status === 200) {
        closeEditDHCPServerModal();
      }
    } catch (error) {
      console.error("An error occurred while creating the dhcp server: ", error);
    }
  };

  return loading ? <WaveLoader /> : (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Edit PPP Profile</h2>
          <button
            onClick={closeEditDHCPServerModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="relay"
                className="block text-sm font-medium text-gray-700"
              >
                Relay
              </label>
              <input
                type="text"
                id="relay"
                value={relay}
                onChange={(e) => setRelay(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="localAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Address Pool
              </label>
              <div className="">
                <select
                  id="localAddressSelect"
                  value={selectedPool}
                  onChange={(e) => setSelectedPool(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select from Pool
                  </option>
                  {ipPools.map((pool) => (
                    <option key={pool.id} value={pool.name}>
                      {pool.name} ({pool.ip_pool}){" "}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="interface"
                className="block text-sm font-medium text-gray-700"
              >
                Interface
              </label>
              <select
                id="interface"
                value={selectedInterface}
                onChange={(e) => setSelectedInterface(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="" disabled>Select an interface</option>
                {interfaces.map((interfaceName, index) => (
                  <option key={index} value={interfaceName}>
                    {interfaceName}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </form>
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default EditDHCPServer;
