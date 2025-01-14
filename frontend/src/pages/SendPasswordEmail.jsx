import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api'
import SuccessModal from '../components/SuccessModal';
import ErrorModal from './ErrorModal';

const SendPasswordEmail = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCloseErrorModal = () => {
        setError('');
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const rootPath = `${window.location.protocol}//${window.location.host}`;
            // Adding your custom path
            const customPath = "/password/recover";
            const fullUrl = `${rootPath}${customPath}`;

            // Prepare the data for submission
            const data = {
                email: email,
                url: fullUrl,
            };

            const response = await api.post("api/user/forgot-password/", data)
            if (response.status === 200) {
                setShowSuccessModal(true)
            }
            // Clear the error message on successful form submission
            setErrorMessage("");
            
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const formattedError = Object.keys(errorData)
                    .map((key) => `${key}: ${errorData[key]}`)
                    .join(', ');
    
                setError(formattedError);
           }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                    Enter your Email Address
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Existing Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-600"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-between space-x-4 mt-4">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Send Email
                        </button>
                    </div>
                </form>
            </div>
            <SuccessModal
                isVisible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate("/login");
                }}
                message="Email sent successfully!"
            />
                  {error && <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />}
        </div>
    );
};

export default SendPasswordEmail;
