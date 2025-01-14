import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from '../components/SuccessModal';
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';

const EditClient = ({ closeModal, clientID}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comment, setComment] = useState(null);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => { 
    const fetchClientData = async () => {
      try {
        const response = await api.get(`/api/clients/${clientID}/`);
        setComment(response.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchClientData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setComment(prevComment => ({
      ...prevComment,
      [name]: value
    }));
  };


  const handleGenerateClick = async () => {  
    try {
      const response = await api.put(`/api/clients/${clientID}/`, JSON.stringify(comment));
      if (response.status === 200){
        setShowSuccessModal(true)
      }
    } catch (error) {
      handleError(error);
    }
  };  

  const isFormValid = () => {
    const { first_name, last_name, email, custom_id, phone, location, apartment, house_no } = comment;
    return first_name && last_name && email && custom_id && phone && location && apartment && house_no;
  };

  return comment && (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-l-lg shadow-lg w-full max-w-sm h-screen flex flex-col justify-between">
        <div className="flex items-center mb-5">
        <FontAwesomeIcon 
            icon={faTimes} 
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300" 
            onClick={closeModal}
            title="Close"
          />
          <h2 className="text-xl flex flex-1 font-semibold justify-center  text-blue-900">Edit Client</h2>
          
        </div>
        <div className="overflow-y-auto flex-grow">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 font-sm mb-1">First Name</label>
              <input type="text" name="first_name" value={comment.first_name} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-sm mb-1">Last Name</label>
              <input type="text" name="last_name" value={comment.last_name} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Email</label>
            <input type="email" name="email" value={comment.email} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Custom ID</label>
            <input type="email" name="custom_id" value={comment.custom_id} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Phone</label>
            <input type="tel" name="phone" value={comment.phone} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">County</label>
            <input type="text" name="county" value={comment.county} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Location</label>
            <input type="text" name="location" value={comment.location} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Apartment</label>
            <input type="text" name="apartment" value={comment.apartment} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">House No</label>
            <input type="text" name="house_no" value={comment.house_no} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Longitude</label>
            <input type="text" name="longitude" value={comment.longitude} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-sm mb-1">Latitude</label>
            <input type="text" name="latitude" value={comment.latitude} onChange={handleInputChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
          </div>
        </div>
        <div className="mb-4">
          <button onClick={handleGenerateClick} disabled={!isFormValid()} className={`w-full p-3 text-white rounded-lg ${!isFormValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 transition-all duration-300'}`}>
            Update
          </button>
          
        </div>
        <SuccessModal
          isVisible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            closeModal();
          }}
          message="Client Profile updated successfully!"
        />
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default EditClient;
