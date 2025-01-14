import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreatePPPProfile from '../components/CreatePPPProfile';
import EditPPPProfile from "../components/EditPPPProfile";
import DeletePPPProfile from "../components/DeletePPPProfile";
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const PPPProfile = () => {
  const [isCreatePPPProfileModalOpen, setIsCreatePPPProfileModalOpen] = useState(false);
  const [isEditPPPProfileModalOpen, setIsEditPPPProfileModalOpen] = useState(false);
  const [isDeletePPPProfileModalOpen, setIsDeletePPPProfileModalOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedPPPProfile, setSelectedPPPProfile] = useState(null);
  const [loading, setLoading] = useState(null)
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchPPPProfile();
  }, []);

  const fetchPPPProfile = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/ppp/profiles/");
      setProfiles(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false)
    }
  };

  const openCreatePPPProfileModal = () => setIsCreatePPPProfileModalOpen(true);

  const closeCreatePPPProfileModal = () => {
    setIsCreatePPPProfileModalOpen(false);
    fetchPPPProfile();
  };

  const openEditPPPProfileModal = (profile) => {
    setSelectedPPPProfile(profile);
    setIsEditPPPProfileModalOpen(true);
  };

  const closeEditPPPProfileModal = () => {
    setIsEditPPPProfileModalOpen(false);
    setSelectedPPPProfile(null);
    fetchPPPProfile();
  };

  const openDeletePPPProfileModal = (profile) => {
    setSelectedPPPProfile(profile);
    setIsDeletePPPProfileModalOpen(true);
  };

  const closeDeletePPPProfileModal = () => {
    setIsDeletePPPProfileModalOpen(false);
    setSelectedPPPProfile(null);
    fetchPPPProfile();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">PPP/Profiles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Local Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Remote Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rate Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">DNS Server</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Secondary DNS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price [KES]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiry [days]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreatePPPProfileModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.local_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.remote_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.rate_limit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.primary_dns}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.secondary_dns}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.expiry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditPPPProfileModal(profile)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeletePPPProfileModal(profile)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isCreatePPPProfileModalOpen}
        onRequestClose={closeCreatePPPProfileModal}
        contentLabel="Create PPPProfile"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreatePPPProfile closeCreatePPPProfileModal={closeCreatePPPProfileModal} />
      </Modal>
      <Modal
        isOpen={isEditPPPProfileModalOpen}
        onRequestClose={closeEditPPPProfileModal}
        contentLabel="Edit PPPProfile"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedPPPProfile && <EditPPPProfile closeEditPPPProfileModal={closeEditPPPProfileModal} profile={selectedPPPProfile} />}
      </Modal>
      <Modal
        isOpen={isDeletePPPProfileModalOpen}
        onRequestClose={closeDeletePPPProfileModal}
        contentLabel="Delete PPPProfile"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedPPPProfile && <DeletePPPProfile closeDeletePPPProfileModal={closeDeletePPPProfileModal} profile={selectedPPPProfile} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default PPPProfile;
