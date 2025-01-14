import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ErrorModal from './ErrorModal';

const ChangeUserPasswordModal = ({ closeChangeUserPasswordModal, email }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(''); 

    const handleCloseErrorModal = () => {
		setError('');
	};

    const handleChangePasswordClick = async () => {
        try {
            const rootPath = `${window.location.protocol}//${window.location.host}`;
            // Adding your custom path
            const customPath = "/password/recover";
            const fullUrl = `${rootPath}${customPath}`;
            const data = {url: fullUrl}
          const response = await api.post(`/api/user/change-password-prompt/`, data);
          if (response.status === 200){
            setShowSuccessModal(true);
          }
          
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const formattedError = Object.keys(errorData)
                    .map((key) => `${key}: ${errorData[key]}`)
                    .join(', ');
    
                setError(formattedError);
            } else {
                setError('Connection error.');
            }
        } finally {
          closeChangeUserPasswordModal()
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeChangeUserPasswordModal}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeChangeUserPasswordModal}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Change Password</h2>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-center">Confirm that you want to change the password. An email will be sent to ({email}) with instructions on how to change the password</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleChangePasswordClick}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={closeChangeUserPasswordModal}
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
                    closeChangeUserPasswordModal();
                }}
                message="Router Deleted successfully!"
            />
            {error && <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />}
        </div>
    );
};

export default ChangeUserPasswordModal;
