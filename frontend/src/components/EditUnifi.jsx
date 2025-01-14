import React, { useEffect, useState } from 'react';
import api from '../api';

const EditUnifi = ({ closeEditUnifiModal, data }) => {
    const [host, setHost] = useState(data.host);
    const [port, setPort] = useState(data.port);
    const [version, setVersion] = useState(data.version);
    const [username, setUsername] = useState(data.username);
    const [password, setPassword] = useState(data.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            host, port, version, username, password
          };
    
        try {
          const response = await api.post('/api/hotspot/credentials/', JSON.stringify(data));
          if (response.status === 201) {
            closeEditUnifiModal();
          }
        } catch (error) {
          console.error("An error occurred while updating the credentials: ", error);
        }
      };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Edit Credentials</h2>
          <button
            onClick={closeEditUnifiModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Host</label>
            <input
              type="text"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="rateLimit" className="block text-sm font-medium text-gray-700">Port</label>
            <input
              type="text"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="dnsServer" className="block text-sm font-medium text-gray-700">Version</label>
            <input
              type="version"
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="dnsServer" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="secondaryDns" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUnifi;
