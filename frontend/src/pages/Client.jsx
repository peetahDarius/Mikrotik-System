import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import EditClient from "./EditClient";
import SendMessageModal from "../components/SendMessageModal";
import SendEmailModal from "../components/SendEmailModal";
import api from "../api";
import {
  MdOutlinePhone,
  MdOutlineLocationOn,
  MdOutlineRoomPreferences,
  MdMap,
  MdFingerprint,
  MdAccountBalance,
  MdMapsHomeWork,
} from "react-icons/md";
import DepositCash from '../components/DepositCash'
import DeleteClientModal from "../components/DeleteClientModal";
import ResolvePayment from "../components/ResolvePayment";
import CreateNewService from "../components/CreateNewService";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import PPPService from "./PPPService";
import DHCPService from "./DHCPService";
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from "../components/WaveLoader";

const Client = () => {
  const location = useLocation();
  const clientID = location.state.clientID;
  const [pppServiceID, setPPPServiceID] = useState(null);
  const [dhcpServiceID, setDHCPServiceID] = useState(null);
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] =
    useState(false);
  const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);
  const [isResolvePaymentModalOpen, setIsResolvePaymentModalOpen] =
    useState(false);
  const [isCreateNewServiceModalOpen, setIsCreateNewServiceModalOpen] =
    useState(false);
  const [disabled, setDisabled] = useState(null);
  const [isDepositCashModalOpen, setIsDepositCashModalOpen] = useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();
  const [displayPPPService, setDisplayPPPService] = useState(false)
  const [displayDHCPService, setDisplayDHCPService] = useState(false)
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/clients/services/${clientID}/`);
      console.log(response.data)
      setClient(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  const openSendMessageModal = () => setIsSendMessageModalOpen(true);
  const closeSendMessageModal = () => {
    setIsSendMessageModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  const openSendEmailModal = () =>
    setIsSendEmailModalOpen(true);
  const closeSendEmailModal = () => {
    setIsSendEmailModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  const openDeleteClientModal = () => setIsDeleteClientModalOpen(true);
  const closeDeleteClientModal = () => {
    setIsDeleteClientModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  const openResolvePaymentModal = () => setIsResolvePaymentModalOpen(true);
  const closeResolvePaymentModal = () => {
    setIsResolvePaymentModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  const openCreateNewServiceModal = () =>
    setIsCreateNewServiceModalOpen(true);
  const closeCreateNewServiceModal = () => {
    setIsCreateNewServiceModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  const openDepositCashModal = () => setIsDepositCashModalOpen(true);
  const closeDepositCashModal = () => {
    setIsDepositCashModalOpen(false);
    fetchServices(); // Refresh data when the modal closes
  };

  useEffect(() => {
    fetchServices();
  }, [clientID, disabled]);

  return loading ? <WaveLoader /> : (
    <div>
      <div className="p-6 space-y-6 ">
        <div className="flex flex-row justify-between items-center mb-6">
          <div></div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none">
                Options
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
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openSendEmailModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Send Email
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Edit Client Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openDepositCashModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Deposit Cash
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openResolvePaymentModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Resolve Payment
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openDeleteClientModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Delete Client
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        <div className="grid grid-cols-4 gap-0">
          <div className="col-span-3 w-full">
            <div className="flex shadow-lg rounded-lg">
              <div className="flex-1 bg-white p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-300 h-24 w-24 rounded-full text-2xl font-bold text-gray-700 capitalize flex items-center justify-center">
                    {client.first_name && client.first_name[0]}{" "}
                    {client.last_name && client.last_name[0]}
                  </div>
                  <div className="ml-6 flex-grow flex flex-col justify-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
                      {client.first_name} {client.last_name}
                    </h2>
                    <p className="text-md text-gray-600 mb-1">{client.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Client Details
                </h3>
                <div className="flex items-center mb-3">
                  <MdOutlinePhone className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    <span className="mr-8"> Contact </span> {client.phone}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdOutlineLocationOn className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    {" "}
                    <span className="mr-7"> Location </span> {client.location}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdMapsHomeWork className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    {" "}
                    <span className="mr-4"> Apartment </span>
                    {client.apartment}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdOutlineRoomPreferences className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    <span className="mr-5"> House No</span> {client.house_no}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdFingerprint className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    <span className="mr-4"> Custom ID</span> {client.custom_id}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdMap className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    <span className="mr-5"> Longitude</span> {client.longitude}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdMap className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    <span className="mr-8"> Latitude</span> {client.latitude}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  <MdAccountBalance className="mr-3 text-gray-500 text-lg" />
                  <p className="text-sm text-gray-700">
                    <span className="mr-8"> Balance </span> {client.balance}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 w-full pl-6">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Services{" "}
              </h4>
              <div className="space-y-4">
                {client.dhcp_services &&
                  client.dhcp_services.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-row justify-start gap-4 text-md text-gray-600"
                    >
                      <span className="font-medium">Static Account</span>
                      <span
                        onClick={() => {
                          setDHCPServiceID(service.id)
                          setDisplayDHCPService(true)
                          setDisplayPPPService(false)
                        }}
                        className="font-semibold text-blue-400 hover:text-blue-800 cursor-pointer"
                      >
                        {service.name}
                      </span>
                    </div>
                  ))}
                  {client.ppp_services &&
                  client.ppp_services.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-row justify-start gap-4 text-md text-gray-600"
                    >
                      <span className="font-medium">PPPoE Account</span>
                      <span
                        onClick={() => {
                          setPPPServiceID(service.id)
                          setDisplayPPPService(true)
                          setDisplayDHCPService(false)
                        }}
                        className="font-semibold text-blue-400 hover:text-blue-800 cursor-pointer"
                      >
                        {service.username}
                      </span>
                    </div>
                  ))}
              </div>

              <button
                onClick={openCreateNewServiceModal}
                className="mt-6 w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700"
              >
                Add New Service
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit PPP Account"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <EditClient
            closeModal={closeModal}
            clientID={clientID}
          />
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
            phoneNumber={client.phone}
          />
        </Modal>

        <Modal
          isOpen={isSendEmailModalOpen}
          onRequestClose={closeSendEmailModal}
          contentLabel="Change Username"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <SendEmailModal
            closeSendEmailModal={closeSendEmailModal}
            email={client.email}
            serviceID={client.id}
          />
        </Modal>
        <Modal
          isOpen={isDeleteClientModalOpen}
          onRequestClose={closeDeleteClientModal}
          contentLabel="Delete Client"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <DeleteClientModal
            closeDeleteClientModal={closeDeleteClientModal}
            clientID={clientID}
          />
        </Modal>
        <Modal
          isOpen={isResolvePaymentModalOpen}
          onRequestClose={closeResolvePaymentModal}
          contentLabel="Change Client Plan"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <ResolvePayment closeResolvePayment={closeResolvePaymentModal} />
        </Modal>

        <Modal
          isOpen={isDepositCashModalOpen}
          onRequestClose={closeDepositCashModal}
          contentLabel="Change Client Plan"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <DepositCash
            closeDepositCash={closeDepositCashModal}
            clientID={clientID}
          />
        </Modal>

        <Modal
          isOpen={isCreateNewServiceModalOpen}
          onRequestClose={closeCreateNewServiceModal}
          contentLabel="Change Client Plan"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <CreateNewService
            closeCreateNewService={closeCreateNewServiceModal}
            clientID={clientID}
          />
        </Modal>
      </div>
      {ErrorModalComponent}
      {displayPPPService && pppServiceID && <PPPService pppServiceID={pppServiceID} clientID={clientID} />}
      {displayDHCPService && dhcpServiceID && <DHCPService dhcpServiceID={dhcpServiceID} clientID={clientID} />}
    </div>
  );
};

export default Client;
