import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";

const ChangeClientDHCPPackageModal = ({ closeChangeClientDHCPPackageModal, selectedPackage, serviceID }) => {
    const [dhcpPackages, setDHCPPackages] = useState([]);
    const { handleError, ErrorModalComponent } = useErrorHandler();

    useEffect(() => {
        
        const fetchProfiles = async () => {
          try {
            const response = await api.get('/api/static/packages/');
            setDHCPPackages(response.data);
          } catch (error) {
            handleError(error);          }
        };  
        fetchProfiles();
      }, []);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSaveClick = async () => {
    const data = {package: selectedPlan};
    try {
      const response = await api.patch(`/api/clients/dhcp/${serviceID}/`, JSON.stringify(data));
      if (response.status === 200) {
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.log("The Error is: ", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeChangeClientDHCPPackageModal}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faTimes}
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
            onClick={closeChangeClientDHCPPackageModal}
            title="Close"
          />
          <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Change client's service</h2>
        </div>
        <div className="mb-4">
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value={selectedPackage} selected >{selectedPackage}</option>
              {dhcpPackages.map((dhcpPackage) => (
                <option key={dhcpPackage['.id']} value={dhcpPackage.name}>
                  {dhcpPackage.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Save
          </button>
          <button
            onClick={closeChangeClientDHCPPackageModal}
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
            closeChangeClientDHCPPackageModal();
          }}
          message="Client's Plan changed successfully!"
        />
      )}
      {ErrorModalComponent}
    </div>
  );
};

export default ChangeClientDHCPPackageModal;
