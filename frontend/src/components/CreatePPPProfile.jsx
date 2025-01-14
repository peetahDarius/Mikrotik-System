import React, { useEffect, useState } from 'react';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from './WaveLoader';

const CreatePPPProfile = ({ closeCreatePPPProfileModal }) => {
  const [name, setName] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [remoteAddress, setRemoteAddress] = useState('');
  const [rateLimit, setRateLimit] = useState('');
  const [dnsServer, setDnsServer] = useState('');
  const [secondaryDns, setSecondaryDns] = useState('');
  const [price, setPrice] = useState('');
  const [expiry, setExpiry] = useState(30);
  const [loading, setLoading] = useState(true);
  const [ipPools, setIpPools] = useState([]);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchPools();
  }, []);

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
      local_address: localAddress,
      remote_address: remoteAddress,
      rate_limit: rateLimit,
      primary_dns: dnsServer,
      secondary_dns: secondaryDns,
      price: price,
      expiry: expiry
    };

    try {
      const response = await api.post('/api/ppp/profiles/', JSON.stringify(data));
      console.log("The data: ", response.data);
      if (response.status === 201) {
        closeCreatePPPProfileModal();
      }
    } catch (error) {
      handleError(error);
    }
  };

  return loading ? <WaveLoader /> : (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Add PPP Profile</h2>
          <button
            onClick={closeCreatePPPProfileModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
            <label htmlFor="localAddress" className="block text-sm font-medium text-gray-700">Local Address</label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="localAddress"
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                className="block w-1/2 px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type IP Address"
                required
              />
              <select
                id="localAddressSelect"
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                className="block w-1/2 px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select from Pool</option>
                {ipPools.map((pool) => (
                  <option key={pool.id} value={pool.name}>{pool.name} ({pool.ip_pool}) </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="remoteAddress" className="block text-sm font-medium text-gray-700">Remote Address</label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="remoteAddress"
                value={remoteAddress}
                onChange={(e) => setRemoteAddress(e.target.value)}
                className="block w-1/2 px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type IP Address"
                required
              />
              <select
                id="remoteAddressSelect"
                value={remoteAddress}
                onChange={(e) => setRemoteAddress(e.target.value)}
                className="block w-1/2 px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select from Pool</option>
                {ipPools.map((pool) => (
                  <option key={pool.id} value={pool.name}>{pool.name} ({pool.ip_pool})</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="rateLimit" className="block text-sm font-medium text-gray-700">Rate Limit</label>
            <input
              type="text"
              id="rateLimit"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              placeholder='e.g., 10M/10M'
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="dnsServer" className="block text-sm font-medium text-gray-700">DNS Server</label>
            <input
              type="text"
              id="dnsServer"
              value={dnsServer}
              onChange={(e) => setDnsServer(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="secondaryDns" className="block text-sm font-medium text-gray-700">Secondary DNS</label>
            <input
              type="text"
              id="secondaryDns"
              value={secondaryDns}
              onChange={(e) => setSecondaryDns(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='Set the price for the profile'
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Expiry</label>
            <input
              type="number"
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder='Set the price for the profile'
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </form>
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default CreatePPPProfile;
