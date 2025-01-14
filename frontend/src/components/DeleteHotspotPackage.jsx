import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const DeleteHotspotPackageModal = ({ closeDeleteHotspotPackageModal, aPackage }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const handleDeleteClick = async () => {
        try {
          const response = await api.delete(`/api/hotspot/packages/${aPackage.id}/`);
          if (response.status === 204){
            setShowSuccessModal(true);
          }
          
        } catch (error) {
          console.error('Error Deleting Secret', error);
        } finally {
          navigate('/packages');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeDeleteHotspotPackageModal}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeDeleteHotspotPackageModal}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Delete Package</h2>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-center">Are you sure you want to Delete this Package?</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={closeDeleteHotspotPackageModal}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <SuccessModal
                isVisible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    closeDeleteHotspotPackageModal();
                }}
                message="Hotspot Package Deleted successfully!"
            />
        </div>
    );
};

export default DeleteHotspotPackageModal;
