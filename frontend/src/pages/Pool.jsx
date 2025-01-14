import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreatePool from '../components/CreatePool';
import EditPool from "../components/EditPool";
import DeletePool from "../components/DeletePool";
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const Pool = () => {
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);
  const [isEditPoolModalOpen, setIsEditPoolModalOpen] = useState(false);
  const [isDeletePoolModalOpen, setIsDeletePoolModalOpen] = useState(false);
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [loading, setLoading] = useState(null)
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchPool();
  }, []);

  const fetchPool = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/pool/");
      setPools(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false)
    }
  };

  const openCreatePoolModal = () => setIsCreatePoolModalOpen(true);

  const closeCreatePoolModal = () => {
    setIsCreatePoolModalOpen(false);
    fetchPool();
  };

  const openEditPoolModal = (Pool) => {
    setSelectedPool(Pool);
    setIsEditPoolModalOpen(true);
  };

  const closeEditPoolModal = () => {
    setIsEditPoolModalOpen(false);
    setSelectedPool(null);
    fetchPool();
  };

  const openDeletePoolModal = (Pool) => {
    setSelectedPool(Pool);
    setIsDeletePoolModalOpen(true);
  };

  const closeDeletePoolModal = () => {
    setIsDeletePoolModalOpen(false);
    setSelectedPool(null);
    fetchPool();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ip/pool</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pool Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreatePoolModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pools.map((pool) => (
                <tr key={Pool.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pool.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pool.ip_pool}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditPoolModal(pool)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeletePoolModal(pool)}
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
        isOpen={isCreatePoolModalOpen}
        onRequestClose={closeCreatePoolModal}
        contentLabel="Create Pool"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreatePool closeCreatePoolModal={closeCreatePoolModal} />
      </Modal>
      <Modal
        isOpen={isEditPoolModalOpen}
        onRequestClose={closeEditPoolModal}
        contentLabel="Edit Pool"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedPool && <EditPool closeEditPoolModal={closeEditPoolModal} pool={selectedPool} />}
      </Modal>
      <Modal
        isOpen={isDeletePoolModalOpen}
        onRequestClose={closeDeletePoolModal}
        contentLabel="Delete Pool"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedPool && <DeletePool closeDeletePoolModal={closeDeletePoolModal} pool={selectedPool} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default Pool;
