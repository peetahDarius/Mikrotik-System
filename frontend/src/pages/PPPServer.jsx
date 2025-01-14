import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreatePPPServer from '../components/CreatePPPServer';
import EditPPPServer from "../components/EditPPPServer";
import DeletePPPServerModal from '../components/DeletePPPServer';
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';

const PPPServer = () => {
  const [isCreatePPPServerModalOpen, setIsCreatePPPServerModalOpen] = useState(false);
  const [isEditPPPServerModalOpen, setIsEditPPPServerModalOpen] = useState(false);
  const [isDeletePPPServerModalOpen, setIsDeletePPPServerModalOpen] = useState(false);
  const [servers, setServers] = useState([]);
  const [selectedPPPServer, setSelectedPPPServer] = useState(null);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchPPPServer();
  }, []);

  const fetchPPPServer = async () => {
    try {
      const response = await api.get("/api/ppp/server/");
      setServers(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const openCreatePPPServerModal = () => setIsCreatePPPServerModalOpen(true);

  const closeCreatePPPServerModal = () => {
    setIsCreatePPPServerModalOpen(false);
    fetchPPPServer();
  };

  const openEditPPPServerModal = (pppServer) => {
    setSelectedPPPServer(pppServer);
    setIsEditPPPServerModalOpen(true);
  };

  const closeEditPPPServerModal = () => {
    setIsEditPPPServerModalOpen(false);
    setSelectedPPPServer(null);
    fetchPPPServer();
  };

  const openDeletePPPServerModal = (pppServer) => {
    setSelectedPPPServer(pppServer);
    setIsDeletePPPServerModalOpen(true);
  };
  
  const closeDeletePPPServerModal = () => {
    setIsDeletePPPServerModalOpen(false);
    setSelectedPPPServer(null);
  };

  return (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">PPP/Servers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Interface</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Max MTU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Max MRU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreatePPPServerModal}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server["max_mtu"]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server["max_mru"]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditPPPServerModal(server)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeletePPPServerModal(server)}
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
        isOpen={isCreatePPPServerModalOpen}
        onRequestClose={closeCreatePPPServerModal}
        contentLabel="Create Router"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreatePPPServer closeCreatePPPServerModal={closeCreatePPPServerModal} />
      </Modal>
      <Modal
        isOpen={isEditPPPServerModalOpen}
        onRequestClose={closeEditPPPServerModal}
        contentLabel="Edit Router"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedPPPServer && <EditPPPServer closeEditPPPServerModal={closeEditPPPServerModal} pppServer={selectedPPPServer} />}
      </Modal>
      <Modal
        isOpen={isDeletePPPServerModalOpen}
        onRequestClose={closeDeletePPPServerModal}
        contentLabel="Delete PPP Server"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedPPPServer && <DeletePPPServerModal closeDeletePPPServerModal={closeDeletePPPServerModal} pppServer={selectedPPPServer} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default PPPServer;
