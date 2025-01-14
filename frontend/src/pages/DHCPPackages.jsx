import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import CreateDHCPPackage from '../components/CreateDHCPPackage';
import EditDHCPPackage from "../components/EditDHCPPackage";
import DeleteDHCPPackage from "../components/DeleteDHCPPackage";
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const DHCPPackage = () => {
  const [isCreateDHCPPackageModalOpen, setIsCreateDHCPPackageModalOpen] = useState(false);
  const [isEditDHCPPackageModalOpen, setIsEditDHCPPackageModalOpen] = useState(false);
  const [isDeleteDHCPPackageModalOpen, setIsDeleteDHCPPackageModalOpen] = useState(false);
  const [dhcpPackages, setPackages] = useState([]);
  const [selectedDHCPPackage, setSelectedDHCPPackage] = useState(null);
  const [loading, setLoading] = useState(null)
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchDHCPPackage();
  }, []);

  const fetchDHCPPackage = async () => {
    setLoading(true)
    try {
      const response = await api.get("/api/static/packages/");
      setPackages(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false)
    }
  };

  const openCreateDHCPPackageModal = () => setIsCreateDHCPPackageModalOpen(true);

  const closeCreateDHCPPackageModal = () => {
    setIsCreateDHCPPackageModalOpen(false);
    fetchDHCPPackage();
  };

  const openEditDHCPPackageModal = (dhcpPackage) => {
    setSelectedDHCPPackage(dhcpPackage);
    setIsEditDHCPPackageModalOpen(true);
  };

  const closeEditDHCPPackageModal = () => {
    setIsEditDHCPPackageModalOpen(false);
    setSelectedDHCPPackage(null);
    fetchDHCPPackage();
  };

  const openDeleteDHCPPackageModal = (dhcpPackage) => {
    setSelectedDHCPPackage(dhcpPackage);
    setIsDeleteDHCPPackageModalOpen(true);
  };

  const closeDeleteDHCPPackageModal = () => {
    setIsDeleteDHCPPackageModalOpen(false);
    setSelectedDHCPPackage(null);
    fetchDHCPPackage();
  };

  return loading ? <WaveLoader /> : (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">DHCP/Packages</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Max Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price [ksh]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiry [days]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button className="text-blue-500 hover:text-blue-700 flex-1" onClick={openCreateDHCPPackageModal}>
                    <h2 className=' text-left text-xs font-medium uppercase flex '> 
                      <FaPlus className='mr-2 items-center'/> Add 
                    </h2>  
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dhcpPackages.map((dhcpPackage) => (
                <tr key={dhcpPackage.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dhcpPackage.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dhcpPackage.max_limit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dhcpPackage.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dhcpPackage.expiry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditDHCPPackageModal(dhcpPackage)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteDHCPPackageModal(dhcpPackage)}
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
        isOpen={isCreateDHCPPackageModalOpen}
        onRequestClose={closeCreateDHCPPackageModal}
        contentLabel="Create DHCPPackage"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateDHCPPackage closeCreateDHCPPackageModal={closeCreateDHCPPackageModal} />
      </Modal>
      <Modal
        isOpen={isEditDHCPPackageModalOpen}
        onRequestClose={closeEditDHCPPackageModal}
        contentLabel="Edit DHCPPackage"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedDHCPPackage && <EditDHCPPackage closeEditDHCPPackageModal={closeEditDHCPPackageModal} dhcpPackage={selectedDHCPPackage} />}
      </Modal>
      <Modal
        isOpen={isDeleteDHCPPackageModalOpen}
        onRequestClose={closeDeleteDHCPPackageModal}
        contentLabel="Delete DHCPPackage"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedDHCPPackage && <DeleteDHCPPackage closeDeleteDHCPPackageModal={closeDeleteDHCPPackageModal} dhcpPackage={selectedDHCPPackage} />}
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default DHCPPackage;
