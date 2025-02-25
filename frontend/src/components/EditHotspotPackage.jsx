import React, { useEffect, useState } from 'react';
import api from '../api';

const EditHotspotPackage = ({ closeEditHotspotPackageModal, aPackage }) => {
  const [name, setName] = useState(aPackage.name);
  const [duration, setDuration] = useState(aPackage.minutes);
  const [up, setUp] = useState(aPackage.up);
  const [down, setDown] = useState(aPackage.down);
  const [byteQuota, setByteQuota] = useState(aPackage.byte_quota);
  const [price, setPrice] = useState(aPackage.amount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      minutes: duration,
      up: up,
      down: down,
      byte_quota: byteQuota,
      amount: price
    };

    try {
      const response = await api.put(`/api/hotspot/packages/${aPackage.id}/`, JSON.stringify(data));
      if (response.status === 200) {
        closeEditHotspotPackageModal();
      }
    } catch (error) {
      console.error("An error occurred while updating the package: ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Edit Package</h2>
          <button
            onClick={closeEditHotspotPackageModal}
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
            <label htmlFor="rateLimit" className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder='Duration in minutes'
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="dnsServer" className="block text-sm font-medium text-gray-700">Up</label>
            <input
              type="number"
              id="up"
              value={up}
              onChange={(e) => setUp(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="dnsServer" className="block text-sm font-medium text-gray-700">Down</label>
            <input
              type="number"
              id="down"
              value={down}
              onChange={(e) => setDown(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="secondaryDns" className="block text-sm font-medium text-gray-700">Byte Quota</label>
            <input
              type="number"
              id="byteQuota"
              value={byteQuota}
              onChange={(e) => setByteQuota(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='Set the price for the package'
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
    </div>
  );
};

export default EditHotspotPackage;
