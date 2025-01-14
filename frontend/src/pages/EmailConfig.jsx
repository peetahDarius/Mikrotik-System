import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import CreateEmailConfig from "../components/CreateEmailConfig";
import EditEmailConfig from "../components/EditEmailConfig";
import DeleteEmailConfigModal from "../components/DeleteEmailConfigModal";
import api from "../api";
import ErrorModal from "../components/ErrorModal";

const EmailConfig = () => {
  const [isCreateEmailConfigModalOpen, setIsCreateEmailConfigModalOpen] =
    useState(false);
  const [isEditEmailConfigModalOpen, setIsEditEmailConfigModalOpen] =
    useState(false);
  const [isDeleteEmailConfigModalOpen, setIsDeleteEmailConfigModalOpen] =
    useState(false);
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [selectedEmailConfig, setSelectedEmailConfig] = useState(null);
  const [error, setError] = useState("");

  const handleCloseErrorModal = () => {
    setError("");
  };

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  const fetchEmailConfig = async () => {
    try {
      const response = await api.get("/api/emails/configurations/");
      console.log(response.data);
      setEmailConfigs(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const formattedError = Object.keys(errorData)
          .map((key) => `${key}: ${errorData[key]}`)
          .join(", ");

        setError(formattedError);
      } else {
        setError("Connection error.");
      }
    }
  };

  const openCreateEmailConfigModal = () =>
    setIsCreateEmailConfigModalOpen(true);

  const closeCreateEmailConfigModal = () => {
    setIsCreateEmailConfigModalOpen(false);
    fetchEmailConfig();
  };

  const openEditEmailConfigModal = (emailConfig) => {
    setSelectedEmailConfig(emailConfig);
    setIsEditEmailConfigModalOpen(true);
  };

  const closeEditEmailConfigModal = () => {
    setIsEditEmailConfigModalOpen(false);
    setSelectedEmailConfig(null);
    fetchEmailConfig();
  };

  const openDeleteEmailConfigModal = (emailConfig) => {
    setSelectedEmailConfig(emailConfig);
    setIsDeleteEmailConfigModalOpen(true);
  };

  const closeDeleteEmailConfigModal = () => {
    setIsDeleteEmailConfigModalOpen(false);
    setSelectedEmailConfig(null);
    fetchEmailConfig();
  };

  return (
    <div className="flex max-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Emails Configurations
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {" "}
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Use-TLS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Is Default
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <button
                    className="text-blue-500 hover:text-blue-700 flex-1"
                    onClick={openCreateEmailConfigModal}
                  >
                    <h2 className=" text-left text-xs font-medium uppercase flex ">
                      <FaPlus className="mr-2 items-center" /> Add
                    </h2>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emailConfigs.map((emailConfig) => (
                <tr key={emailConfig.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {emailConfig.email_host_user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {String(emailConfig.use_tls)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emailConfig.email_host}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emailConfig.is_active ? (
                      <span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
                        Default
                      </span>
                    ) : (
                      <span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
                        false
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emailConfig.email_port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    **************
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditEmailConfigModal(emailConfig)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteEmailConfigModal(emailConfig)}
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
        isOpen={isCreateEmailConfigModalOpen}
        onRequestClose={closeCreateEmailConfigModal}
        contentLabel="Create EmailConfig"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        <CreateEmailConfig
          closeCreateEmailConfigModal={closeCreateEmailConfigModal}
        />
      </Modal>
      <Modal
        isOpen={isEditEmailConfigModalOpen}
        onRequestClose={closeEditEmailConfigModal}
        contentLabel="Edit EmailConfig"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedEmailConfig && (
          <EditEmailConfig
            closeEditEmailConfigModal={closeEditEmailConfigModal}
            emailConfig={selectedEmailConfig}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteEmailConfigModalOpen}
        onRequestClose={closeDeleteEmailConfigModal}
        contentLabel="Edit EmailConfig"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
      >
        {selectedEmailConfig && (
          <DeleteEmailConfigModal
            closeDeleteEmailConfigModal={closeDeleteEmailConfigModal}
            emailConfig={selectedEmailConfig}
          />
        )}
      </Modal>
      {error && (
        <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />
      )}
    </div>
  );
};

export default EmailConfig;
