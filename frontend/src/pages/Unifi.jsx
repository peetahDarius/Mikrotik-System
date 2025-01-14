import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateUnifi from '../components/CreateUnifi';
import EditUnifi from "../components/EditUnifi";
import DeleteUnifi from "../components/DeleteUnifi";
import api from '../api';
import WaveLoader from '../components/WaveLoader';

const Unifi = () => {
  const [isCreateUnifiModalOpen, setIsCreateUnifiModalOpen] = useState(false);
  const [isEditUnifiModalOpen, setIsEditUnifiModalOpen] = useState(false);
  const [isDeleteUnifiModalOpen, setIsDeleteUnifiModalOpen] = useState(false);
  const [unifiData, setUnifiData] = useState([]);
  const [selectedUnifi, setSelectedUnifi] = useState(null);
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    fetchUnifi();
  }, []);

  const fetchUnifi = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/hotspot/credentials/");
      setUnifiData(response.data);
    } catch (error) {
    } finally {
      setLoading(false)
    }
  };

  const openCreateUnifiModal = () => setIsCreateUnifiModalOpen(true);

  const closeCreateUnifiModal = () => {
    setIsCreateUnifiModalOpen(false);
    fetchUnifi();
  };

  const openEditUnifiModal = (data) => {
    setSelectedUnifi(data);
    setIsEditUnifiModalOpen(true);
  };

  const closeEditUnifiModal = () => {
    setIsEditUnifiModalOpen(false);
    setSelectedUnifi(null);
    fetchUnifi();
  };

  const openDeleteUnifiModal = (data) => {
    setSelectedUnifi(data);
    setIsDeleteUnifiModalOpen(true);
  };

  const closeDeleteUnifiModal = () => {
    setIsDeleteUnifiModalOpen(false);
    setSelectedUnifi(null);
    fetchUnifi();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings/Hotspot</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Host</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Port</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateUnifiModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unifiData.map((data) => (
                <tr key={data.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.host}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.port}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditUnifiModal(data)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteUnifiModal(data)}
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
        isOpen={isCreateUnifiModalOpen}
        onRequestClose={closeCreateUnifiModal}
        contentLabel="Create Unifi"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateUnifi closeCreateUnifiModal={closeCreateUnifiModal} />
      </Modal>
      <Modal
        isOpen={isEditUnifiModalOpen}
        onRequestClose={closeEditUnifiModal}
        contentLabel="Edit Unifi"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedUnifi && <EditUnifi closeEditUnifiModal={closeEditUnifiModal} data={selectedUnifi} />}
      </Modal>
      <Modal
        isOpen={isDeleteUnifiModalOpen}
        onRequestClose={closeDeleteUnifiModal}
        contentLabel="Delete Unifi"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedUnifi && <DeleteUnifi closeDeleteUnifiModal={closeDeleteUnifiModal} data={selectedUnifi} />}
      </Modal>
    </div>
  );
};

export default Unifi;
