import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const EditPool = ({ closeEditPoolModal, pool }) => {
  const [name, setName] = useState(pool.name);
  const [ipPool, setPool] = useState(pool.ip_pool);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      ip_pool: ipPool,
    };

    try {
      const response = await api.put(`/api/pool/${pool.id}/`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("The data: ", response.data);
      if (response.status === 200) {
        closeEditPoolModal(); 
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Pool Configuration</h2>
          <button
            onClick={closeEditPoolModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pool Name</label>
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
            <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">IP Address</label>
            <input
              type="text"
              id="ipPool"
              value={ipPool}
              onChange={(e) => setPool(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default EditPool;
