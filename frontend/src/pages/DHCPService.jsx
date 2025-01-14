import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import EditPPPAccount from "./EditPPPAccount";
import BindDHCPMacAddressModal from "../components/BindDHCPMacAddressModal";
import ExtendDHCPSubscriptionModal from "../components/ExtendDHCPSubscriptionModal";
import ChangeIpAddressModal from "../components/ChangeIpAddressModal";
import api from "../api";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineProfile } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";
import SuspendDHCPClientModal from "../components/SuspendDHCPClientModal";
import ActivateDHCPClientModal from "../components/ActivateDHCPClientModal";
import DeleteDHCPServiceModal from "../components/DeleteDHCPServiceModal";
import ChangeClientDHCPPackageModal from "../components/ChangeClientDHCPPackageModal";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import DHCPClientStatus from "../components/DHCPClientStatus";
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from "../components/WaveLoader";

const DHCPService = ({ dhcpServiceID, clientID }) => {
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(false);
  const [isBindDHCPMacAddressModalOpen, setIsBindDHCPMacAddressModalOpen] = useState(false);
  const [isChangeIpAddressModalOpen, setIsChangeIpAddressModalOpen] =
    useState(false);
  const [
    isExtendDHCPSubscriptionModalOpen,
    setIsExtendDHCPSubscriptionModalOpen,
  ] = useState(false);
  const [isSuspendDHCPClientModalOpen, setIsSuspendDHCPClientModalOpen] =
    useState(false);
  const [isActivateDHCPClientModalOpen, setIsActivateDHCPClientModalOpen] =
    useState(false);
  const [isDeleteDHCPServiceModalOpen, setIsDeleteDHCPServiceModalOpen] =
    useState(false);
  const [
    isChangeClientDHCPPackageModalOpen,
    setIsChangeClientDHCPPackageModalOpen,
  ] = useState(false);
  const [pppSecret, setPPPSecret] = useState("");
  const [selectedOption, setSelectedOption] = useState("options");
  const { handleError, ErrorModalComponent } = useErrorHandler();

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/clients/dhcp/${dhcpServiceID}/`);
      setService(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [dhcpServiceID]);

  const openBindDHCPMacAddressModal = () => setIsBindDHCPMacAddressModalOpen(true);
  const closeBindDHCPMacAddressModal = () => {
    setIsBindDHCPMacAddressModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openChangeIpAddressModal = () =>
    setIsChangeIpAddressModalOpen(true);
  const closeChangeIpAddressModal = () => {
    setIsChangeIpAddressModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openExtendDHCPSubscriptionModal = () =>
    setIsExtendDHCPSubscriptionModalOpen(true);
  const closeExtendDHCPSubscriptionModal = () => {
    setIsExtendDHCPSubscriptionModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openSuspendDHCPClientModal = () => setIsSuspendDHCPClientModalOpen(true);
  const closeSuspendDHCPClientModal = () => {
    setIsSuspendDHCPClientModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openActivateDHCPClientModal = () =>
    setIsActivateDHCPClientModalOpen(true);
  const closeActivateDHCPClientModal = () => {
    setIsActivateDHCPClientModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openDeleteDHCPServiceModal = () => setIsDeleteDHCPServiceModalOpen(true);
  const closeDeleteDHCPServiceModal = () => {
    setIsDeleteDHCPServiceModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openChangeClientDHCPPackageModal = () =>
    setIsChangeClientDHCPPackageModalOpen(true);
  const closeChangeClientDHCPPackageModal = () => {
    setIsChangeClientDHCPPackageModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  return loading ? <WaveLoader /> : (
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
                  onClick={openBindDHCPMacAddressModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Bind Mac Address
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openChangeClientDHCPPackageModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Change Service
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openChangeIpAddressModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Change IP Address
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openExtendDHCPSubscriptionModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Extend Subscription
                </button>
              )}
            </Menu.Item>
            {service.is_suspended ? (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openActivateDHCPClientModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Activate Service
                  </button>
                )}
              </Menu.Item>
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openSuspendDHCPClientModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Suspend Service
                  </button>
                )}
              </Menu.Item>
            )}

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Reset Site
                </button>
              )}
            </Menu.Item>

            {/* <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Resolve Payment
            </button>
          )}
        </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openDeleteDHCPServiceModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Delete Service
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      <div className="grid grid-cols-4 gap-0">
        <div className="col-span-2 w-full">
          <div className="flex shadow-lg rounded-lg">
            <div className="flex-1 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Static Service
              </h3>
              <div className="flex items-center mb-3">
                <FaRegUser className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-4">Name</span> {service.name}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <RiLockPasswordLine className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-5"> IP Address </span>
                  {service.ip_address}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <RiLockPasswordLine className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-5"> MAC Address </span>
                  {service.mac_address}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineProfile className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  {" "}
                  <span className="mr-12"> Package </span> {service.package}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineProfile className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-3"> Suspension Date </span>
                  {service.is_suspended && <> Suspended at </>}
                  {new Date(service.suspension_date).toLocaleString("default", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" at " +
                    new Date(service.suspension_date).toLocaleTimeString(
                      "default",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <GiMoneyStack className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm flex flex-1 flex-row text-gray-700">
                  {" "}
                  <span className="mr-12 flex"> Status </span>{" "}
                  <h1 className="flex"> <DHCPClientStatus serviceName={service.name} /> </h1> 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBindDHCPMacAddressModalOpen}
        onRequestClose={closeBindDHCPMacAddressModal}
        contentLabel="Send Message"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <BindDHCPMacAddressModal
          closeBindDHCPMacAddressModal={closeBindDHCPMacAddressModal}
          ipAddress={service.ip_address}
          serviceID={service.id}
        />
      </Modal>
      <Modal
        isOpen={isChangeIpAddressModalOpen}
        onRequestClose={closeChangeIpAddressModal}
        contentLabel="Change IP Address"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ChangeIpAddressModal
          closeChangeIpAddressModal={closeChangeIpAddressModal}
          serviceID={service.id}
        />
      </Modal>
      <Modal
        isOpen={isExtendDHCPSubscriptionModalOpen}
        onRequestClose={closeExtendDHCPSubscriptionModal}
        contentLabel="Extend Subscription"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ExtendDHCPSubscriptionModal
          closeExtendDHCPSubscriptionModal={closeExtendDHCPSubscriptionModal}
          serviceID={service.id}
        />
      </Modal>

      <Modal
        isOpen={isSuspendDHCPClientModalOpen}
        onRequestClose={closeSuspendDHCPClientModal}
        contentLabel="Suspend Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <SuspendDHCPClientModal
          closeSuspendDHCPClientModal={closeSuspendDHCPClientModal}
          serviceID={service.id}
        />
      </Modal>

      <Modal
        isOpen={isActivateDHCPClientModalOpen}
        onRequestClose={closeActivateDHCPClientModal}
        contentLabel="Activate Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ActivateDHCPClientModal
          closeActivateDHCPClientModal={closeActivateDHCPClientModal}
          serviceID={service.id}
        />
      </Modal>

      <Modal
        isOpen={isDeleteDHCPServiceModalOpen}
        onRequestClose={closeDeleteDHCPServiceModal}
        contentLabel="Delete Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <DeleteDHCPServiceModal
          closeDeleteDHCPServiceModal={closeDeleteDHCPServiceModal}
          serviceID={dhcpServiceID}
          clientID={clientID}
          pppSecret={pppSecret}
        />
      </Modal>
      <Modal
        isOpen={isChangeClientDHCPPackageModalOpen}
        onRequestClose={closeChangeClientDHCPPackageModal}
        contentLabel="Change Client Plan"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ChangeClientDHCPPackageModal
          closeChangeClientDHCPPackageModal={closeChangeClientDHCPPackageModal}
          selectedPackage={service.package}
          serviceID={service.id}
        />
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default DHCPService;
