import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateAddress from '../components/CreateAddress';
import EditAddress from "../components/EditAddress";
import DeleteAddress from "../components/DeleteAddress";
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const Addresses = () => {
  const [isCreateAddressModalOpen, setIsCreateAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(null)
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/ip/addresses/");
      setAddresses(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false)
    }
  };

  const openCreateAddressModal = () => setIsCreateAddressModalOpen(true);

  const closeCreateAddressModal = () => {
    setIsCreateAddressModalOpen(false);
    fetchAddress();
  };

  const openEditAddressModal = (address) => {
    setSelectedAddress(address);
    setIsEditAddressModalOpen(true);
  };

  const closeEditAddressModal = () => {
    setIsEditAddressModalOpen(false);
    setSelectedAddress(null);
    fetchAddress();
  };

  const openDeleteAddressModal = (address) => {
    setSelectedAddress(address);
    setIsDeleteAddressModalOpen(true);
  };

  const closeDeleteAddressModal = () => {
    setIsDeleteAddressModalOpen(false);
    setSelectedAddress(null);
    fetchAddress();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ip/address</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Interface</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateAddressModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {addresses.map((address) => (
                <tr key={address.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{address.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{address.network}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{address.interface}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditAddressModal(address)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteAddressModal(address)}
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
        isOpen={isCreateAddressModalOpen}
        onRequestClose={closeCreateAddressModal}
        contentLabel="Create Address"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateAddress closeCreateAddressModal={closeCreateAddressModal} />
      </Modal>
      <Modal
        isOpen={isEditAddressModalOpen}
        onRequestClose={closeEditAddressModal}
        contentLabel="Edit Address"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedAddress && <EditAddress closeEditAddressModal={closeEditAddressModal} address={selectedAddress} />}
      </Modal>
      <Modal
        isOpen={isDeleteAddressModalOpen}
        onRequestClose={closeDeleteAddressModal}
        contentLabel="Delete Address"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedAddress && <DeleteAddress closeDeleteAddressModal={closeDeleteAddressModal} address={selectedAddress} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default Addresses;
