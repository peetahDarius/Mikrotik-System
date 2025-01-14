import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateHotspotPackage from '../components/CreateHotspotPackage';
import EditHotspotPackage from "../components/EditHotspotPackage";
import DeleteHotspotPackage from "../components/DeleteHotspotPackage";
import api from '../api';
import WaveLoader from '../components/WaveLoader';

const HotspotPackage = () => {
  const [isCreateHotspotPackageModalOpen, setIsCreateHotspotPackageModalOpen] = useState(false);
  const [isEditHotspotPackageModalOpen, setIsEditHotspotPackageModalOpen] = useState(false);
  const [isDeleteHotspotPackageModalOpen, setIsDeleteHotspotPackageModalOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedHotspotPackage, setSelectedHotspotPackage] = useState(null);
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    fetchHotspotPackage();
  }, []);

  const fetchHotspotPackage = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/hotspot/packages/");
      setPackages(response.data);
    } catch (error) {
    } finally {
      setLoading(false)
    }
  };

  const openCreateHotspotPackageModal = () => setIsCreateHotspotPackageModalOpen(true);

  const closeCreateHotspotPackageModal = () => {
    setIsCreateHotspotPackageModalOpen(false);
    fetchHotspotPackage();
  };

  const openEditHotspotPackageModal = (aPackage) => {
    setSelectedHotspotPackage(aPackage);
    setIsEditHotspotPackageModalOpen(true);
  };

  const closeEditHotspotPackageModal = () => {
    setIsEditHotspotPackageModalOpen(false);
    setSelectedHotspotPackage(null);
    fetchHotspotPackage();
  };

  const openDeleteHotspotPackageModal = (aPackage) => {
    setSelectedHotspotPackage(aPackage);
    setIsDeleteHotspotPackageModalOpen(true);
  };

  const closeDeleteHotspotPackageModal = () => {
    setIsDeleteHotspotPackageModalOpen(false);
    setSelectedHotspotPackage(null);
    fetchHotspotPackage();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Packages/</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Up</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Down</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Byte Quota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price [KES]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateHotspotPackageModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((aPackage) => (
                <tr key={aPackage.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aPackage.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aPackage.minutes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aPackage.up}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aPackage.down}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aPackage.byte_quota}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aPackage.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditHotspotPackageModal(aPackage)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteHotspotPackageModal(aPackage)}
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
        isOpen={isCreateHotspotPackageModalOpen}
        onRequestClose={closeCreateHotspotPackageModal}
        contentLabel="Create HotspotPackage"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateHotspotPackage closeCreateHotspotPackageModal={closeCreateHotspotPackageModal} />
      </Modal>
      <Modal
        isOpen={isEditHotspotPackageModalOpen}
        onRequestClose={closeEditHotspotPackageModal}
        contentLabel="Edit HotspotPackage"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedHotspotPackage && <EditHotspotPackage closeEditHotspotPackageModal={closeEditHotspotPackageModal} aPackage={selectedHotspotPackage} />}
      </Modal>
      <Modal
        isOpen={isDeleteHotspotPackageModalOpen}
        onRequestClose={closeDeleteHotspotPackageModal}
        contentLabel="Delete HotspotPackage"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedHotspotPackage && <DeleteHotspotPackage closeDeleteHotspotPackageModal={closeDeleteHotspotPackageModal} aPackage={selectedHotspotPackage} />}
      </Modal>
    </div>
  );
};

export default HotspotPackage;
