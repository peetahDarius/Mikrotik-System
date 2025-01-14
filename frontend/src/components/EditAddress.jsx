import React, { useState, useEffect } from "react";
import api from "../api";
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from "./WaveLoader";

const EditAddress = ({ closeEditAddressModal, address }) => {
  const [ipAddress, setIpAddress] = useState(address.address);
  const [selectedInterface, setSelectedInterface] = useState(address.interface);
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(null);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchInterfaces();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      interface: selectedInterface,
      address: ipAddress,
    };

    try {
      const response = await api.put(
        `/api/ip/addresses/${address.id}/`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("The data: ", response.data);
      if (response.status === 200) {
        closeEditAddressModal();
      }
    } catch (error) {
      handleError(error);    }
  };

  return (
    loading ? <WaveLoader /> : (
      <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
        <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-center text-indigo-600">
              Address Configuration
            </h2>
            <button
              onClick={closeEditAddressModal}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="ipAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Address/Address Range
              </label>
              <input
                type="text"
                id="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.160.88.1/24 or 192.168.88.5-192.168.88.20"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
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
                <option value="">Select an interface</option>
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
    )
  );
};

export default EditAddress;
