import React, { useEffect, useState } from 'react';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const CreateDHCPNetwork = ({ closeCreateDHCPNetworkModal }) => {
  const [address, setAddress] = useState('');
  const [gateway, setGateway] = useState('');
  const [dnsServer, setDnsServer] = useState('');
  const [secondaryDns, setSecondaryDns] = useState('');
  const [defaultLimit, setDefaultLimit] = useState("1M/1M")
  const { handleError, ErrorModalComponent } = useErrorHandler();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      address: address,
      gateway: gateway,
      primary_dns: dnsServer,
      secondary_dns: secondaryDns,
      default_limit: defaultLimit,
    };

    try {
      const response = await api.post('/api/dhcp/networks/', JSON.stringify(data));
      if (response.status === 201) {
        closeCreateDHCPNetworkModal();
      }
    } catch (error) {
      handleError(error);    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Add DHCP Network</h2>
          <button
            onClick={closeCreateDHCPNetworkModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Gateway</label>
            <input
              type="text"
              id="gateway"
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
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
            <label htmlFor="secondaryDns" className="block text-sm font-medium text-gray-700">Default Max-Limit</label>
            <input
              type="text"
              id="default_limit"
              value={defaultLimit}
              onChange={(e) => setDefaultLimit(e.target.value)}
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

export default CreateDHCPNetwork;
