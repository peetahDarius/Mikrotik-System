import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateRouter from '../components/CreateRouter';
import EditRouter from "../components/EditRouter";
import api from '../api';

const PPPServer = () => {
  const [isCreateRouterModalOpen, setIsCreateRouterModalOpen] = useState(false);
  const [isEditRouterModalOpen, setIsEditRouterModalOpen] = useState(false);
  const [routers, setRouters] = useState([]);
  const [selectedRouter, setSelectedRouter] = useState(null);

  useEffect(() => {
    fetchRouter();
  }, []);

  const fetchRouter = async () => {
    try {
      const response = await api.get("/api/router/");
      setRouters(response.data);
    } catch (error) {
      console.log("An error has occurred: ", error);
    }
  };

  const openCreateRouterModal = () => setIsCreateRouterModalOpen(true);

  const closeCreateRouterModal = () => {
    setIsCreateRouterModalOpen(false);
    fetchRouter();
  };

  const openEditRouterModal = (router) => {
    setSelectedRouter(router);
    setIsEditRouterModalOpen(true);
  };

  const closeEditRouterModal = () => {
    setIsEditRouterModalOpen(false);
    setSelectedRouter(null);
    fetchRouter();
  };

  return (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Routers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Router Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Password</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateRouterModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routers.map((router) => (
                <tr key={router.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{router.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{router.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{router.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{router.password}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditRouterModal(router)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      // onClick={() => handleDeleteRouter(router.id)}
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
        isOpen={isCreateRouterModalOpen}
        onRequestClose={closeCreateRouterModal}
        contentLabel="Create Router"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateRouter closeCreateRouterModal={closeCreateRouterModal} />
      </Modal>
      <Modal
        isOpen={isEditRouterModalOpen}
        onRequestClose={closeEditRouterModal}
        contentLabel="Edit Router"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedRouter && <EditRouter closeEditRouterModal={closeEditRouterModal} router={selectedRouter} />}
      </Modal>
    </div>
  );
};

export default PPPServer;
