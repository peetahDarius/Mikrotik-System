import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from '../components/SuccessModal';
import mikrotikApi from '../mikrotikApi';
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';

const EditPPPAccount = ({ closeModal, clientID, pppSecret}) => {
  const [profile, setProfile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [pppProfiles, setPppProfiles] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comment, setComment] = useState(null);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await mikrotikApi.get('/api/rest/ppp/profile');
        console.log("The profiles: ", response.data);
        setPppProfiles(response.data);
      } catch (error) {
        handleError(error);      }
    };  
    const fetchClientData = async () => {
      try {
        const response = await api.get(`/api/ppp-clients/${clientID}`);
        console.log("The Data: ", response.data);
        const clientInfo = {...response.data, profile: pppSecret[0].profile}
        setComment(clientInfo);
      } catch (error) {
        handleError(error);      }
    };
    fetchProfiles();
    fetchClientData();
  }, []);

  const handleSelectChange = (event) => {
    setProfile(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setComment(prevComment => ({
      ...prevComment,
      [name]: value
    }));
  };


  const handleGenerateClick = async () => {  
  const updatedSecret = pppSecret[0]
  console.log("The updated secret: ", updatedSecret);
    try {
      const response = await mikrotikApi.patch(`/api/rest/ppp/secret/${updatedSecret[".id"]}`, JSON.stringify({profile: profile}));
      if (response.status === 200 ) {
        await api.put(`/api/ppp-clients/${clientID}`, JSON.stringify(comment));
      }
    } catch (error) {
      console.error('Error updating PPP secret:', error);
    }
  };  

  const isFormValid = () => {
    const { first_name, last_name, email, custom_id, phone, location, apartment, house_no } = comment;
    return profile && first_name && last_name && email && custom_id && phone && location && apartment && house_no;
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
            <label className="block text-sm text-gray-700 font-sm mb-1">Profile</label>
            <select value={profile} onChange={handleSelectChange} className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500">
              <option value={comment.profile} selected >{comment.profile}</option>
              {pppProfiles.map((profile) => (
                <option key={profile['.id']} value={profile.name}>
                  {profile.name}
                </option>
              ))}
            </select>
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
          message="PPP Secret created successfully!"
        />
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default EditPPPAccount;



// {username && password && (
//   <div className="mt-4 text-center bg-gray-100 p-4 rounded-lg shadow-inner">
//     <p className="mb-2"><strong>Username:</strong> <span className="font-mono text-gray-700">{username}</span></p>
//     <p className="mb-2"><strong>Password:</strong> <span className="font-mono text-gray-700">{password}</span></p>
//     <FontAwesomeIcon 
//       icon={faCopy} 
//       className="text-blue-500 cursor-pointer mt-3 hover:text-blue-700 transition-all duration-300" 
//       onClick={handleCopyClick} 
//       title="Copy to clipboard"
//     />
//     {copySuccess && <p className="mt-2 text-green-500">{copySuccess}</p>}
//   </div>
// )}

// const handleCopyClick = () => {
//   const textToCopy = `Username: ${username}\nPassword: ${password}`;
//   navigator.clipboard.writeText(textToCopy)
//     .then(() => setCopySuccess('Copied!'))
//     .catch(() => setCopySuccess('Failed to copy'));
// };