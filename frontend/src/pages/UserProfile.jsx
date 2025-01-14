import React, { useEffect, useState } from "react";
import Avatar from "../img/usr-avatar.png";
import { ACCESS_TOKEN } from "../apiConstants";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import SuccessModal from "../components/SuccessModal";
import useErrorHandler from "../components/useErrorHandler.";
import { FiEdit } from "react-icons/fi"; // Import the Edit icon from react-icons
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom"; // Import useNavigate for page redirection
import ChangeUserPasswordModal from '../components/ChangeUserPasswordModal';

const UserProfile = () => {
  const [loading, setLoading] = useState(null);
  const [userId, setUserId] = useState(0);
  const [isChangeUserPasswordModalOpen, setIsChangeUserPasswordModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();
  const [selectedUserId, setSelectedUserId] = useState(userId)
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const userId = jwtDecode(token).user_id;
      setUserId(userId);
      const response = await api.get(`api/user/${userId}/`);
      setUserData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handler to update user data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`api/user/${userId}/`, userData);
      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const openChangeUserPasswordModal = (userId) => {
    setSelectedUserId(userId);
    setIsChangeUserPasswordModalOpen(true);
  };

  const closeChangeUserPasswordModal = () => {
    setIsChangeUserPasswordModalOpen(false);
  };

  return (
    !loading && (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* User Avatar */}
            <div className="flex justify-center mb-6">
              <img
                src={Avatar}
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                Personal Information
              </h2>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={userData.username}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-600"
                  >
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={userData.first_name}
                    onChange={handleChange}
                    className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-600"
                  >
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={userData.last_name}
                    onChange={handleChange}
                    className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-600"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
             
            </div>

            {/* Update Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Update Profile
              </button>
            </div>
          </form>
          <div className="flex flex-col mt-3 mb-16 mx-6 ">
  <label
    htmlFor="password"
    className="text-sm font-medium text-gray-600"
  >
    Password
  </label>
  <div className="relative mt-2">
    <input
      id="password"
      type="text"
      value="*****************"
      className="p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
      readOnly
    />
    <button
      onClick={() => openChangeUserPasswordModal(userId)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M17.414 2.586a2 2 0 00-2.828 0L6.1 11.072a1 1 0 00-.263.455l-1 4a1 1 0 001.21 1.21l4-1a1 1 0 00.455-.263l8.486-8.486a2 2 0 000-2.828zm-6.586 6.586L15 5.414 16.586 7l-4.172 4.172-1.414-1.414z" />
      </svg>
    </button>
  </div>
</div>

        </div>
        <Modal
        isOpen={isChangeUserPasswordModalOpen}
        onRequestClose={closeChangeUserPasswordModal}
        contentLabel="Change Password"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedUserId && <ChangeUserPasswordModal closeChangeUserPasswordModal={closeChangeUserPasswordModal} email={userData.email} />}
      </Modal>
        {showSuccessModal && (
          <SuccessModal
            isVisible={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              fetchUserData();
            }}
            message="Profile updated successfully!"
          />
        )}
        {ErrorModalComponent}
      </div>
    )
  );
};

export default UserProfile;
