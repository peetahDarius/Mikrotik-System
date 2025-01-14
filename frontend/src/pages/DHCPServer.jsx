import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateDHCPServer from '../components/CreateDHCPServer';
import EditDHCPServer from "../components/EditDHCPServer";
import DeleteDHCPServer from "../components/DeleteDHCPServer";
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const DHCPServer = () => {
  const [isCreateDHCPServerModalOpen, setIsCreateDHCPServerModalOpen] = useState(false);
  const [isEditDHCPServerModalOpen, setIsEditDHCPServerModalOpen] = useState(false);
  const [isDeleteDHCPServerModalOpen, setIsDeleteDHCPServerModalOpen] = useState(false);
  const [servers, setServers] = useState([]);
  const [selectedDHCPServer, setSelectedDHCPServer] = useState(null);
  const [loading, setLoading] = useState(null)
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchDHCPServer();
  }, []);

  const fetchDHCPServer = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/dhcp/servers/");
      setServers(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false)
    }
  };

  const openCreateDHCPServerModal = () => setIsCreateDHCPServerModalOpen(true);

  const closeCreateDHCPServerModal = () => {
    setIsCreateDHCPServerModalOpen(false);
    fetchDHCPServer();
  };

  const openEditDHCPServerModal = (server) => {
    setSelectedDHCPServer(server);
    setIsEditDHCPServerModalOpen(true);
  };

  const closeEditDHCPServerModal = () => {
    setIsEditDHCPServerModalOpen(false);
    setSelectedDHCPServer(null);
    fetchDHCPServer();
  };

  const openDeleteDHCPServerModal = (server) => {
    setSelectedDHCPServer(server);
    setIsDeleteDHCPServerModalOpen(true);
  };

  const closeDeleteDHCPServerModal = () => {
    setIsDeleteDHCPServerModalOpen(false);
    setSelectedDHCPServer(null);
    fetchDHCPServer();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">DHCP/Server</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Interface</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Relay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address Pool</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateDHCPServerModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servers.map((server) => (
                <tr key={server.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{server.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.interface}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.relay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.pool}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditDHCPServerModal(server)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteDHCPServerModal(server)}
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
        isOpen={isCreateDHCPServerModalOpen}
        onRequestClose={closeCreateDHCPServerModal}
        contentLabel="Create DHCPServer"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateDHCPServer closeCreateDHCPServerModal={closeCreateDHCPServerModal} />
      </Modal>
      <Modal
        isOpen={isEditDHCPServerModalOpen}
        onRequestClose={closeEditDHCPServerModal}
        contentLabel="Edit DHCPServer"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedDHCPServer && <EditDHCPServer closeEditDHCPServerModal={closeEditDHCPServerModal} server={selectedDHCPServer} />}
      </Modal>
      <Modal
        isOpen={isDeleteDHCPServerModalOpen}
        onRequestClose={closeDeleteDHCPServerModal}
        contentLabel="Delete DHCPServer"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedDHCPServer && <DeleteDHCPServer closeDeleteDHCPServerModal={closeDeleteDHCPServerModal} server={selectedDHCPServer} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default DHCPServer;
