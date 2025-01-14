import React, { useEffect, useState } from 'react';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const EditDHCPPackage = ({ closeEditDHCPPackageModal, dhcpPackage }) => {
    const [name, setName] = useState(dhcpPackage.name);
  const [maxLimit, setMaxLimit] = useState(dhcpPackage.max_limit);
  const [price, setPrice] = useState(dhcpPackage.price);
  const [expiry, setExpiry] =  useState(dhcpPackage.expiry);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
        name: name,
        max_limit: maxLimit,
        price: price,
        expiry: expiry
      };

    try {
      const response = await api.put(`/api/static/packages/${dhcpPackage.id}/`, JSON.stringify(data));
      if (response.status === 200) {
        closeEditDHCPPackageModal();
      }
    } catch (error) {
      handleError(error);    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Edit Package</h2>
          <button
            onClick={closeEditDHCPPackageModal}
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
                htmlFor="maxLimit"
                className="block text-sm font-medium text-gray-700"
              >
                Max Limit
              </label>
              <input
                type="text"
                id="maxLimit"
                value={maxLimit}
                onChange={(e) => setMaxLimit(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry [days]
              </label>
              <input
                type="number"
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
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
      {ErrorModalComponent}
    </div>
  );
};

export default EditDHCPPackage;
