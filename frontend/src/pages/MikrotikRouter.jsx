import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateRouter from '../components/CreateRouter';
import EditRouter from "../components/EditRouter";
import DeleteRouterModal from '../components/DeleteRouterModal';
import api from '../api';
import ErrorModal from '../components/ErrorModal';
import WaveLoader from '../components/WaveLoader';

const MikrotikRouter = () => {
  const [isCreateRouterModalOpen, setIsCreateRouterModalOpen] = useState(false);
  const [isEditRouterModalOpen, setIsEditRouterModalOpen] = useState(false);
  const [isDeleteRouterModalOpen, setIsDeleteRouterModalOpen] = useState(false);
  const [routers, setRouters] = useState([]);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(null);
  const handleCloseErrorModal = () => {
		setError('');
	};

  useEffect(() => {
    fetchRouter();
  }, []);

  const fetchRouter = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/router/");
      setRouters(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const formattedError = Object.keys(errorData)
            .map((key) => `${key}: ${errorData[key]}`)
            .join(', ');

        setError(formattedError);
    } else {
        setError('Connection error.');
    }
    } finally {
      setLoading(false)
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

  const openDeleteRouterModal = (router) => {
    setSelectedRouter(router);
    setIsDeleteRouterModalOpen(true);
  };

  const closeDeleteRouterModal = () => {
    setIsDeleteRouterModalOpen(false);
    setSelectedRouter(null);
    fetchRouter();
  };

  return loading ? <WaveLoader /> : (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">***********</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditRouterModal(router)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteRouterModal(router)}
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

      <Modal
        isOpen={isDeleteRouterModalOpen}
        onRequestClose={closeDeleteRouterModal}
        contentLabel="Edit Router"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedRouter && <DeleteRouterModal closeDeleteRouterModal={closeDeleteRouterModal} router={selectedRouter} />}
      </Modal>
      {error && <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />}
    </div>
  );
};

export default MikrotikRouter;
