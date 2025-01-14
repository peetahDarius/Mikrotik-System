import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import api from "../api";
import NewClient from "./NewClient";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import FileUploadModal from "../components/FileUploadModal";
import SendMessageModal from "../components/SendMessageModal";
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from "../components/WaveLoader";
import PPPClientStatus from "../components/PPPClientStatus";

const PPPoEClients = () => {
  const navigate = useNavigate();
  const [secrets, setSecrets] = useState([]);
  const [sortedSecrets, setSortedSecrets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/clients/ppp/");
        console.log(response.data)
        setSecrets(response.data);
        setSortedSecrets(response.data);
        const numbers = response.data.map((client) => client.phone);
        setPhoneNumbers(numbers);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const sortClients = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...secrets].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setSortedSecrets(sorted);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSecrets = sortedSecrets.filter((secret) =>
    secret.client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    secret.client.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openSendMessageModal = () => setIsSendMessageModalOpen(true);
  const closeSendMessageModal = () => setIsSendMessageModalOpen(false);

  return loading ? <WaveLoader /> : (
    <div className="flex flex-col p-4">
      <div className="overflow-x-auto sm:overflow-visible">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-3">
          <div className="shadow overflow-hidden border-b border-neutral-700 sm:rounded-lg">
            <div className="flex flex-row-reverse justify-between items-center mb-4 gap-4">
              <Menu as="div" className="relative flex text-left">
                <div>
                  <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-neutral-800 py-2 px-4 text-sm font-semibold text-white shadow-inner focus:outline-none">
                    Actions
                    <ChevronDownIcon className="w-5 h-5 text-white/60" />
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={openSendMessageModal}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                      >
                        Send SMS
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <button
                onClick={openModal}
                className="py-2 px-4 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200"
              >
                Add New Client
              </button>
              {/* Search input */}
              <div className="flex flex-grow flex-4 items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search Clients"
                  className="px-4 py-2 text-sm border border-neutral-600 rounded-lg"
                  style={{ width: '25rem' }}
                />
              </div>
              
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-800">
                  <tr>
                    {[
                      { label: "ID", field: "id" },
                      { label: "PPPoE Username", field: "username" },
                      { label: "Name", field: "secret.client.first_name" },
                      { label: "Phone", field: "phone" },
                      { label: "Custom ID", field: "client.custom_id" },
                      { label: "Package Name", field: "profile" },
                      { label: "Is Suspended", field: "is_suspended" },
                      { label: "Is Online", field: "is_Online" },
                      { label: "Balance", field: "client.balance" },
                    ].map((col) => (
                      <th
                        key={col.field}
                        className="px-3 py-3 text-xs font-medium text-neutral-300 uppercase tracking-wider text-left cursor-pointer"
                        onClick={() => sortClients(col.field)}
                      >
                        {col.label}{" "}
                        {sortField === col.field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSecrets.map((secret) => (
                    <tr
                      key={secret.id}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        navigate("/client", {
                          state: { clientID: secret.client.id },
                        })
                      }
                    >
                      <td className="px-3 py-4 text-sm text-gray-500">{secret.id}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{secret.username}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{secret.client.first_name} {secret.client.last_name}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{secret.client.phone}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{secret.client.custom_id}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{secret.profile}</td>
                      { secret.is_suspended ? 
                      <td className="px-3 py-4 text-sm capitalize text-red-600"> Suspended </td>: 
                      <td className="px-3 py-4 text-sm capitalize text-green-600"> Active </td>
                      }
                      <td className="px-3 py-4 text-sm text-gray-900"><PPPClientStatus serviceName={secret.username}/></td>
                      <td className="px-3 py-4 text-sm text-gray-900">{secret.client.balance}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add New Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <NewClient closeModal={closeModal} />
      </Modal>
      <Modal
        isOpen={isSendMessageModalOpen}
        onRequestClose={closeSendMessageModal}
        contentLabel="Send Message"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <SendMessageModal
          closeSendMessageModal={closeSendMessageModal}
          phoneNumber={phoneNumbers}
        />
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default PPPoEClients;
