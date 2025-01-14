import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateMpesaExpress from '../components/CreateMpesaExpress';
import EditMpesaExpress from "../components/EditMpesaExpress";
import DeleteMpesaExpress from "../components/DeleteMpesaExpress";
import api from '../api';
import WaveLoader from '../components/WaveLoader';

const MpesaExpress = () => {
  const [isCreateMpesaExpressModalOpen, setIsCreateMpesaExpressModalOpen] = useState(false);
  const [isEditMpesaExpressModalOpen, setIsEditMpesaExpressModalOpen] = useState(false);
  const [isDeleteMpesaExpressModalOpen, setIsDeleteMpesaExpressModalOpen] = useState(false);
  const [mpesaExpressData, setMpesaExpressData] = useState([]);
  const [selectedMpesaExpress, setSelectedMpesaExpress] = useState(null);
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    fetchMpesaExpress();
  }, []);

  const fetchMpesaExpress = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/hotspot/payment/credentials/");
      setMpesaExpressData(response.data);
    } catch (error) {
    } finally {
      setLoading(false)
    }
  };

  const openCreateMpesaExpressModal = () => setIsCreateMpesaExpressModalOpen(true);

  const closeCreateMpesaExpressModal = () => {
    setIsCreateMpesaExpressModalOpen(false);
    fetchMpesaExpress();
  };

  const openEditMpesaExpressModal = (data) => {
    setSelectedMpesaExpress(data);
    setIsEditMpesaExpressModalOpen(true);
  };

  const closeEditMpesaExpressModal = () => {
    setIsEditMpesaExpressModalOpen(false);
    setSelectedMpesaExpress(null);
    fetchMpesaExpress();
  };

  const openDeleteMpesaExpressModal = (data) => {
    setSelectedMpesaExpress(data);
    setIsDeleteMpesaExpressModalOpen(true);
  };

  const closeDeleteMpesaExpressModal = () => {
    setIsDeleteMpesaExpressModalOpen(false);
    setSelectedMpesaExpress(null);
    fetchMpesaExpress();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings/Mpesa-Express</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Account Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Transaction Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Short code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Callback URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateMpesaExpressModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mpesaExpressData.map((data) => (
                <tr key={data.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.account_reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.transaction_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.short_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.callback_url}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditMpesaExpressModal(data)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteMpesaExpressModal(data)}
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
        isOpen={isCreateMpesaExpressModalOpen}
        onRequestClose={closeCreateMpesaExpressModal}
        contentLabel="Create MpesaExpress"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateMpesaExpress closeCreateMpesaExpressModal={closeCreateMpesaExpressModal} />
      </Modal>
      <Modal
        isOpen={isEditMpesaExpressModalOpen}
        onRequestClose={closeEditMpesaExpressModal}
        contentLabel="Edit MpesaExpress"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedMpesaExpress && <EditMpesaExpress closeEditMpesaExpressModal={closeEditMpesaExpressModal} data={selectedMpesaExpress} />}
      </Modal>
      <Modal
        isOpen={isDeleteMpesaExpressModalOpen}
        onRequestClose={closeDeleteMpesaExpressModal}
        contentLabel="Delete MpesaExpress"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedMpesaExpress && <DeleteMpesaExpress closeDeleteMpesaExpressModal={closeDeleteMpesaExpressModal} data={selectedMpesaExpress} />}
      </Modal>
    </div>
  );
};

export default MpesaExpress;
