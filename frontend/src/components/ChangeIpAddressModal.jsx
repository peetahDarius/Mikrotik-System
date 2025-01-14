import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "./SuccessModal";
import api from "../api";
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from "./WaveLoader";

const ChangeIpAddressModal = ({
  closeChangeIpAddressModal,
  serviceID,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [availableIps, setAvailableIPs] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const [networks, setNetworks] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(null);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    const fetchNetworks = async () => {
      setLoading(true);
      try {
        const response = await api.get("api/dhcp/networks/");
        setNetworks(response.data.map((network) => network.address));
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNetworks();
  }, []);
  useEffect(() => {
    const fetchAvailableIPs = async () => {
      if (selectedNetwork) {
        try {
          const data = {
            subnet: selectedNetwork,
          };
          const response = await api.post("api/dhcp/ip/available/", data);
          setAvailableIPs(response.data);
        } catch (error) {
          handleError(error);
        }
      }
    };
    fetchAvailableIPs();
  }, [selectedNetwork]);
  const handleSaveClick = async () => {
    const data = { ip_address: ipAddress };
    try {
      const response = await api.patch(
        `/api/clients/dhcp/${serviceID}/`,
        JSON.stringify(data)
      );
      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    loading ? <WaveLoader /> : (
      <div className="fixed inset-0 z-50 flex items-start justify-center">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50"
          onClick={closeChangeIpAddressModal}
        ></div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faTimes}
              className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
              onClick={closeChangeIpAddressModal}
              title="Close"
            />
            <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">
              Change IP Address
            </h2>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Network
            </label>
            <select
              value={selectedNetwork}
              required
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="" selected disabled>
                Select network subnet
              </option>
              {networks.map((network, index) => (
                <option key={index} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
          {availableIps.length !== 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                IP Address
              </label>
              <select
                value={ipAddress}
                required
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="" selected disabled>
                  IP Address
                </option>
                {availableIps.map((ip, index) => (
                  <option key={index} value={ip}>
                    {ip}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSaveClick}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Save
            </button>
            <button
              onClick={closeChangeIpAddressModal}
              className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
        {showSuccessModal && (
          <SuccessModal
            isVisible={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              closeChangeIpAddressModal();
            }}
            message="IP Address changed successfully!"
          />
        )}
        {ErrorModalComponent}
      </div>
    )
  );
};

export default ChangeIpAddressModal;
