import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateDHCPNetwork from '../components/CreateDHCPNetwork';
import EditDHCPNetwork from "../components/EditDHCPNetwork";
import DeleteDHCPNetwork from "../components/DeleteDHCPNetwork";
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const DHCPNetwork = () => {
  const [isCreateDHCPNetworkModalOpen, setIsCreateDHCPNetworkModalOpen] = useState(false);
  const [isEditDHCPNetworkModalOpen, setIsEditDHCPNetworkModalOpen] = useState(false);
  const [isDeleteDHCPNetworkModalOpen, setIsDeleteDHCPNetworkModalOpen] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [selectedDHCPNetwork, setSelectedDHCPNetwork] = useState(null);
  const [loading, setLoading] = useState(null)
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchDHCPNetwork();
  }, []);

  const fetchDHCPNetwork = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/dhcp/networks/");
      setNetworks(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false)
    }
  };

  const openCreateDHCPNetworkModal = () => setIsCreateDHCPNetworkModalOpen(true);

  const closeCreateDHCPNetworkModal = () => {
    setIsCreateDHCPNetworkModalOpen(false);
    fetchDHCPNetwork();
  };

  const openEditDHCPNetworkModal = (network) => {
    setSelectedDHCPNetwork(network);
    setIsEditDHCPNetworkModalOpen(true);
  };

  const closeEditDHCPNetworkModal = () => {
    setIsEditDHCPNetworkModalOpen(false);
    setSelectedDHCPNetwork(null);
    fetchDHCPNetwork();
  };

  const openDeleteDHCPNetworkModal = (network) => {
    setSelectedDHCPNetwork(network);
    setIsDeleteDHCPNetworkModalOpen(true);
  };

  const closeDeleteDHCPNetworkModal = () => {
    setIsDeleteDHCPNetworkModalOpen(false);
    setSelectedDHCPNetwork(null);
    fetchDHCPNetwork();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">DHCP/Network</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Gateway</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">DNS Server</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Secondary DNS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Default Max-Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateDHCPNetworkModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {networks.map((network) => (
                <tr key={network.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{network.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{network.gateway}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{network.primary_dns}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{network.secondary_dns}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{network.default_limit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditDHCPNetworkModal(network)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteDHCPNetworkModal(network)}
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
        isOpen={isCreateDHCPNetworkModalOpen}
        onRequestClose={closeCreateDHCPNetworkModal}
        contentLabel="Create DHCPNetwork"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateDHCPNetwork closeCreateDHCPNetworkModal={closeCreateDHCPNetworkModal} />
      </Modal>
      <Modal
        isOpen={isEditDHCPNetworkModalOpen}
        onRequestClose={closeEditDHCPNetworkModal}
        contentLabel="Edit DHCPNetwork"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedDHCPNetwork && <EditDHCPNetwork closeEditDHCPNetworkModal={closeEditDHCPNetworkModal} network={selectedDHCPNetwork} />}
      </Modal>
      <Modal
        isOpen={isDeleteDHCPNetworkModalOpen}
        onRequestClose={closeDeleteDHCPNetworkModal}
        contentLabel="Delete DHCPNetwork"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedDHCPNetwork && <DeleteDHCPNetwork closeDeleteDHCPNetworkModal={closeDeleteDHCPNetworkModal} network={selectedDHCPNetwork} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default DHCPNetwork;
