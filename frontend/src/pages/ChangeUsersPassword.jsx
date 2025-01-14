import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api'
import SuccessModal from '../components/SuccessModal';

const ChangeUsersPassword = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    const encodedUserId = queryParams.get('userId');  // Get the userId from query params
    const [decodedUserId, setDecodedUserId] = useState(null);
    const [existingPassword, setExistingPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    // Decode the userId when the component mounts
    useEffect(() => {
        if (encodedUserId) {
            try {
                const decoded = jwtDecode(encodedUserId); // Decode the encoded userId
                setDecodedUserId(decoded.userId);  // Set the decoded userId in state
            } catch (error) {
                console.error("Error decoding userId:", error);
            }
        }
    }, [encodedUserId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirm password do not match.");
            return;
        }

        // If userId is not decoded, show an error
        if (!decodedUserId) {
            setErrorMessage("Invalid user ID.");
            return;
        }

        // Prepare the data for submission
        const data = {
            existing_password: existingPassword,
            new_password: newPassword,
            user_id: decodedUserId
        };

        const response = await api.post("api/user/change-password/", data)
        console.log(response.data)
        if (response.status === 200) {
            setShowSuccessModal(true)
        }
        // Clear the error message on successful form submission
        setErrorMessage("");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                    Change Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Existing Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="existingPassword"
                            className="text-sm font-medium text-gray-600"
                        >
                            Existing Password
                        </label>
                        <input
                            id="existingPassword"
                            type="text"
                            value={existingPassword}
                            onChange={(e) => setExistingPassword(e.target.value)}
                            required
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="newPassword"
                            className="text-sm font-medium text-gray-600"
                        >
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="type"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-600"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="text"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <SuccessModal
                isVisible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate("/login")
                }}
                message="Password changed successfully!"
            />
        </div>
    );
};

export default ChangeUsersPassword;
