import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import api from '../api'; 
import axios from 'axios';
import useErrorHandler from "./useErrorHandler.";
import { getConfig } from "../config";

const FileUploadModal = ({ closeFileUploadModal }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();
 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  
  const handleFileUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    console.log("the file: ", file)
    console.log("the formdata: ", formData)
  
    try {
      const token = localStorage.getItem("access");
      // const response = await axios.post(`${getConfig("REACT_APP_BACKEND_URL")}/api/clients/import-csv/`, formData, {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/clients/import-csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('File uploaded successfully');
      setShowSuccessModal(true);
    } catch (error) {
      handleError(error);    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeFileUploadModal}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faTimes}
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
            onClick={closeFileUploadModal}
            title="Close"
          />
          <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Upload File</h2>
        </div>
        <div
          className={`mb-4 p-4 border-dashed border-2 rounded-lg ${dragging ? 'border-blue-500' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <p className="text-center">{file.name}</p>
          ) : (
            <p className="text-center">Drag and drop your file here, or click to select a file.</p>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 mt-2"
            accept=".csv"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            disabled={!file}
          >
            Upload File
          </button>
          <button
            onClick={closeFileUploadModal}
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
            closeFileUploadModal();
          }}
          message="File uploaded successfully!"
        />
      )}
      {ErrorModalComponent}
    </div>
    
  );
};

export default FileUploadModal;
