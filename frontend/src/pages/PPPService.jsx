import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import EditPPPAccount from "./EditPPPAccount";
import BindPPPMacAddressModal from "../components/BindPPPMacAddressModal";
import ExtendPPPSubscriptionModal from "../components/ExtendPPPSubscriptionModal";
import ChangePPPPasswordModal from "../components/ChangePPPPasswordModal";
import api from "../api";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineProfile } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";
import SuspendPPPClientModal from "../components/SuspendPPPClientModal";
import ActivatePPPClientModal from "../components/ActivatePPPClientModal";
import DeletePPPServiceModal from "../components/DeletePPPServiceModal";
import ChangeClientPPPProfileModal from "../components/ChangeClientPPPProfile";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import PPPClientStatus from "../components/PPPClientStatus";
import ChangePPPUsernameModal from "../components/ChangePPPUsernameModal";
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from "../components/WaveLoader";

const PPPService = ({ pppServiceID, clientID }) => {
  const [secret, setSecret] = useState({});
  const [loading, setLoading] = useState(false);
  const [isBindPPPMacAddressModalOpen, setIsBindPPPMacAddressModalOpen] = useState(false);
  const [isChangePPPPasswordModalOpen, setIsChangePPPPasswordModalOpen] =
    useState(false);
  const [
    isExtendPPPSubscriptionModalOpen,
    setIsExtendPPPSubscriptionModalOpen,
  ] = useState(false);
  const [isSuspendPPPClientModalOpen, setIsSuspendPPPClientModalOpen] =
    useState(false);
  const [isActivatePPPClientModalOpen, setIsActivatePPPClientModalOpen] =
    useState(false);
  const [isDeletePPPServiceModalOpen, setIsDeletePPPServiceModalOpen] =
    useState(false);
  const [
    isChangeClientPPPProfileModalOpen,
    setIsChangeClientPPPProfileModalOpen,
  ] = useState(false);
  const [pppSecret, setPPPSecret] = useState("");
  const [isChangePPPUsernameModalOpen, setIsChangePPPUsernameModalOpen] =
    useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();
  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/clients/ppp/${pppServiceID}/`);
      console.log(response.data)
      setSecret(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [pppServiceID]);

  const openBindPPPMacAddressModal = () => setIsBindPPPMacAddressModalOpen(true);
  const closeBindPPPMacAddressModal = () => {
    setIsBindPPPMacAddressModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openChangePPPPasswordModal = () =>
    setIsChangePPPPasswordModalOpen(true);
  const closeChangePPPPasswordModal = () => {
    setIsChangePPPPasswordModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openChangePPPUsernameModal = () =>
    setIsChangePPPUsernameModalOpen(true);
  const closeChangePPPUsernameModal = () => {
    setIsChangePPPUsernameModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openExtendPPPSubscriptionModal = () =>
    setIsExtendPPPSubscriptionModalOpen(true);
  const closeExtendPPPSubscriptionModal = () => {
    setIsExtendPPPSubscriptionModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openSuspendPPPClientModal = () => setIsSuspendPPPClientModalOpen(true);
  const closeSuspendPPPClientModal = () => {
    setIsSuspendPPPClientModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openActivatePPPClientModal = () =>
    setIsActivatePPPClientModalOpen(true);
  const closeActivatePPPClientModal = () => {
    setIsActivatePPPClientModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openDeletePPPServiceModal = () => setIsDeletePPPServiceModalOpen(true);
  const closeDeletePPPServiceModal = () => {
    setIsDeletePPPServiceModalOpen(false);
    fetchService(); // Refresh data when the modal closes
  };

  const openChangeClientPPPProfileModal = () =>
    setIsChangeClientPPPProfileModalOpen(true);
  const closeChangeClientPPPProfileModal = () => {
    setIsChangeClientPPPProfileModalOpen(false);
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
                  onClick={openBindPPPMacAddressModal}
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
                  onClick={openChangeClientPPPProfileModal}
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
                  onClick={openChangePPPPasswordModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Change Password
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openChangePPPUsernameModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Change Username
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openExtendPPPSubscriptionModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Extend Subscription
                </button>
              )}
            </Menu.Item>
            {secret.is_suspended ? (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openActivatePPPClientModal}
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
                    onClick={openSuspendPPPClientModal}
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
                  onClick={openDeletePPPServiceModal}
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
                PPPoE Service
              </h3>
              <div className="flex items-center mb-3">
                <FaRegUser className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-4">Username</span> {secret.username}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <RiLockPasswordLine className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-5"> Password </span>
                  {secret.password}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineProfile className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  {" "}
                  <span className="mr-12"> Profile </span> {secret.profile}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineProfile className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  {" "}
                  <span className="mr-12"> MAC Address </span> {secret.caller_id}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineProfile className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700">
                  <span className="mr-3"> Suspension Date </span>
                  {secret.is_suspended && <> Suspended at </>}
                  {new Date(secret.suspension_date).toLocaleString("default", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" at " +
                    new Date(secret.suspension_date).toLocaleTimeString(
                      "default",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                </p>
              </div>
              <div className="flex items-center mb-3">
                <GiMoneyStack className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm flex flex-row text-gray-700">
                  {" "}
                  <span className="mr-12 flex"> Status </span>{" "}
                  <h1><PPPClientStatus serviceName={secret.username} /></h1> 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBindPPPMacAddressModalOpen}
        onRequestClose={closeBindPPPMacAddressModal}
        contentLabel="Send Message"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <BindPPPMacAddressModal
          closeBindPPPMacAddressModal={closeBindPPPMacAddressModal}
          username={secret.username}
          serviceID={secret.id}
        />
      </Modal>
      <Modal
        isOpen={isChangePPPPasswordModalOpen}
        onRequestClose={closeChangePPPPasswordModal}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ChangePPPPasswordModal
          closeChangePPPPasswordModal={closeChangePPPPasswordModal}
          password={secret.password}
          serviceID={secret.id}
        />
      </Modal>
      <Modal
        isOpen={isExtendPPPSubscriptionModalOpen}
        onRequestClose={closeExtendPPPSubscriptionModal}
        contentLabel="Extend Subscription"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ExtendPPPSubscriptionModal
          closeExtendPPPSubscriptionModal={closeExtendPPPSubscriptionModal}
          serviceID={secret.id}
        />
      </Modal>

      <Modal
        isOpen={isSuspendPPPClientModalOpen}
        onRequestClose={closeSuspendPPPClientModal}
        contentLabel="Suspend Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <SuspendPPPClientModal
          closeSuspendPPPClientModal={closeSuspendPPPClientModal}
          serviceID={secret.id}
        />
      </Modal>

      <Modal
        isOpen={isActivatePPPClientModalOpen}
        onRequestClose={closeActivatePPPClientModal}
        contentLabel="Activate Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ActivatePPPClientModal
          closeActivatePPPClientModal={closeActivatePPPClientModal}
          serviceID={secret.id}
        />
      </Modal>

      <Modal
          isOpen={isChangePPPUsernameModalOpen}
          onRequestClose={closeChangePPPUsernameModal}
          contentLabel="Change Username"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <ChangePPPUsernameModal
            closeChangePPPUsernameModal={closeChangePPPUsernameModal}
            username={secret.username}
            serviceID={secret.id}
          />
        </Modal>

      <Modal
        isOpen={isDeletePPPServiceModalOpen}
        onRequestClose={closeDeletePPPServiceModal}
        contentLabel="Delete Client"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <DeletePPPServiceModal
          closeDeletePPPServiceModal={closeDeletePPPServiceModal}
          serviceID={pppServiceID}
          clientID={clientID}
          pppSecret={pppSecret}
        />
      </Modal>
      <Modal
        isOpen={isChangeClientPPPProfileModalOpen}
        onRequestClose={closeChangeClientPPPProfileModal}
        contentLabel="Change Client Plan"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ChangeClientPPPProfileModal
          closeChangeClientPPPProfileModal={closeChangeClientPPPProfileModal}
          selectedProfile={secret.profile}
          serviceID={secret.id}
        />
      </Modal>
      {ErrorModalComponent}
    </div>
  );
};

export default PPPService;
