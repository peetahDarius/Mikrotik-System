import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import EditPPPAccount from './EditPPPAccount';
import SendMessageModal from '../components/SendMessageModal';
// import ExtendSubscriptionModal from '../components/ExtendSubscriptionModal';
import ChangePasswordModal from '../components/ChangePPPPasswordModal';
import api from '../api';
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineProfile } from "react-icons/ai";
import { MdOutlinePhone, MdOutlineLocationOn, MdOutlineRoomPreferences, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { AiOutlineApartment } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";
import mikrotikApi from '../mikrotikApi';
import SuspendClientModal from '../components/SuspendPPPClientModal';
import DeleteClientModal from '../components/DeleteClientModal';
import ChangeClientProfileModal from '../components/ChangeClientPPPProfile';
import { Menu } from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/16/solid'
import { format } from 'date-fns';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const PPPClient = () => {
  const location = useLocation();
  const clientID = location.state.clientID;
  const [secret, setSecret] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeConnections, setActiveConnections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isExtendSubscriptionModalOpen, setIsExtendSubscriptionModalOpen] = useState(false);
  const [isSuspendClientModalOpen, setIsSuspendClientModalOpen] = useState(false);
  const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);
  const [isChangeClientProfileModalOpen, setIsChangeClientProfileModalOpen] = useState(false);
  const [pppSecret, setPPPSecret] = useState('');
  const [selectedOption, setSelectedOption] = useState('options');
  const [disabled, setDisabled] = useState(null)
  const [newEndDate, setNewEndDate] = useState(new Date());
  const { handleError, ErrorModalComponent } = useErrorHandler();

  const fetchSecret = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/ppp-clients/${clientID}`);
      setSecret(response.data);
      if (response.status === 200) {
        const res = await mikrotikApi.get('/api/rest/ppp/secret', { params: { name: encodeURIComponent(response.data.username) } });
        setPPPSecret(res.data);
        if (res.status === 200) {
          const scheduleRes = await mikrotikApi.get('/api/rest/system/schedule', { params: { name: encodeURIComponent(response.data.username) } });
          const currentStartDate = scheduleRes.data[0]['start-date'];
          const currentStartTime = scheduleRes.data[0]['start-time'];
          const interval = scheduleRes.data[0].interval;
          const startDateTime = new Date(`${currentStartDate}T${currentStartTime}`);
          const endDate = addIntervalToDate(startDateTime, interval);
          
          setNewEndDate(endDate);
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const addIntervalToDate = (startDate, interval) => {
    const date = new Date(startDate);
    const intervalRegex = /(\d+)w|(\d+)d/g;
    let match;
    while ((match = intervalRegex.exec(interval)) !== null) {
      if (match[1]) {
        date.setDate(date.getDate() + parseInt(match[1]) * 7);
      }
      if (match[2]) {
        date.setDate(date.getDate() + parseInt(match[2]));
      }
    }
    return date;
  };

  const disableSecret = async () => {
    try {
      const res = await mikrotikApi.patch(`/api/rest/ppp/secret/${pppSecret[0][".id"]}`, JSON.stringify({ disabled: true }));
      if (res.status === 200) {
        const response = await api.patch(`/api/ppp-clients/${clientID}`, JSON.stringify({ disabled: true }));
        if (response.status === 200) {
          setDisabled(true);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const enableSecret = async () => {
    try {
      const res = await mikrotikApi.patch(`/api/rest/ppp/secret/${pppSecret[0][".id"]}`, JSON.stringify({ disabled: false }));
      if (res.status === 200) {
        const response = await api.patch(`/api/ppp-clients/${clientID}`, JSON.stringify({ disabled: false }));
        if (response.status === 200) {
          setDisabled(false);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date"; // Return a fallback value or handle as needed
    }

    // Format the date to "HH:mm MMM dd, yyyy"
    return format(date, 'HH:mm MMM dd, yyyy');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  const openSendMessageModal = () => setIsSendMessageModalOpen(true);
  const closeSendMessageModal = () => {
    setIsSendMessageModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  const openExtendSubscriptionModal = () => setIsExtendSubscriptionModalOpen(true);
  const closeExtendSubscriptionModal = () => {
    setIsExtendSubscriptionModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  const openSuspendClientModal = () => setIsSuspendClientModalOpen(true);
  const closeSuspendClientModal = () => {
    setIsSuspendClientModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  const openDeleteClientModal = () => setIsDeleteClientModalOpen(true);
  const closeDeleteClientModal = () => {
    setIsDeleteClientModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  const openChangeClientProfileModal = () => setIsChangeClientProfileModalOpen(true);
  const closeChangeClientProfileModal = () => {
    setIsChangeClientProfileModalOpen(false);
    fetchSecret(); // Refresh data when the modal closes
  };

  useEffect(() => {
    fetchSecret();
  }, [clientID, disabled]);


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
              onClick={openSendMessageModal}
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Send SMS
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={openChangePasswordModal}
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Change Password
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={openExtendSubscriptionModal}
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Extend Subscription
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={openSuspendClientModal}
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Suspend Client
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Reset Site
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
            >
              Deposit Cash
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
                  DK
                </div>
                <div className="ml-6 flex-grow flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{secret.first_name} {secret.last_name}</h2>
                  <p className="text-md text-gray-600 mb-1">{secret.email}</p>
                  <div className="flex space-x-3 mt-3 mb-4">
                    {secret.disabled ? 
                        <button onClick={() => enableSecret()} className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Enable</button> :
                        <button onClick={() => disableSecret()} className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Disable</button>
                      }
                    <button onClick={openModal} className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition">Edit Profile</button>
                  </div>
                  <div className="flex space-x-4 mb-4 mt-5 -mx-10">
                    <div>
                      <MdOutlineAccountBalanceWallet />
                      <p className="text-md text-gray-600">Balance: 10000</p>
                    </div>
                    <div>
                      <GiMoneyStack />
                      <p className="text-md text-gray-600">Credit: 10000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Details</h3>
              <div className="flex items-center mb-3">
                <FaRegUser className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700"><span className='mr-4'>Username</span> {secret.username}</p>
              </div>
              <div className="flex items-center mb-3">
                <RiLockPasswordLine className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700"><span className='mr-5'> Password </span>{secret.password}</p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineProfile className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700"> <span className='mr-11'> Profile </span> {secret.profile}</p>
              </div>
              <div className="flex items-center mb-3">
                <MdOutlinePhone className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700"><span className='mr-8'> Contact </span> {secret.phone}</p>
              </div>
              <div className="flex items-center mb-3">
                <MdOutlineLocationOn className="mr-3 text-gray-500 text-lg" />
                <p className="text-sm text-gray-700"> <span className='mr-7'> Location </span> {secret.location}</p>
              </div>
              <div className="flex items-center mb-3">
                <AiOutlineApartment className="mr-3 text-gray-500 text-lg" />
<p className="text-sm text-gray-700"> <span className='mr-4'> Apartment </span>{secret.apartment}</p>
</div>
<div className="flex items-center">
<MdOutlineRoomPreferences className="mr-3 text-gray-500 text-lg" />
<p className="text-sm text-gray-700"><span className='mr-5'> House No</span> {secret.house_no}</p>
</div>
</div>
</div>
</div>
<div className="col-span-1 w-full pl-6">
  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Current Plan</h4>
    <div className="space-y-4">
      <div className="flex flex-col justify-between text-md text-gray-600">
        <span className="font-medium">Current Plan</span>
        <span className="font-semibold text-gray-800">{secret.profile}</span>
      </div>
      <div className="flex flex-col justify-between text-md text-gray-600">
        <span className="font-medium">Monthly Usage</span>
        <span className="font-semibold text-gray-800">0 B/0 B</span>
      </div>
      <div className="flex flex-col justify-between text-md text-gray-600">
        <span className="font-medium">Expiry Date</span>
        <span className="font-semibold text-gray-800">{formatDate(newEndDate)}</span>
      </div>
    </div>
    <button
      onClick={openChangeClientProfileModal}
      className="mt-6 w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition transform hover:scale-105"
    >
      Change Plan
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
    <EditPPPAccount closeModal={closeModal} clientID={clientID} pppSecret={pppSecret} />
  </Modal>

  <Modal
    isOpen={isSendMessageModalOpen}
    onRequestClose={closeSendMessageModal}
    contentLabel="Send Message"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <SendMessageModal closeSendMessageModal={closeSendMessageModal} phoneNumber={secret.phone} />
  </Modal>
  <Modal
    isOpen={isChangePasswordModalOpen}
    onRequestClose={closeChangePasswordModal}
    contentLabel="Change Password"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <ChangePasswordModal closeChangePasswordModal={closeChangePasswordModal} password={secret.password} clientID={clientID} pppSecret={pppSecret}/>
  </Modal>
  {/* <Modal
    isOpen={isExtendSubscriptionModalOpen}
    onRequestClose={closeExtendSubscriptionModal}
    contentLabel="Extend Subscription"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <ExtendSubscriptionModal closeExtendSubscriptionModal={closeExtendSubscriptionModal} username={secret.username} />
  </Modal> */}

  <Modal
    isOpen={isSuspendClientModalOpen}
    onRequestClose={closeSuspendClientModal}
    contentLabel="Suspend Client"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <SuspendClientModal closeSuspendClientModal={closeSuspendClientModal} username={secret.username} pppSecret={pppSecret} clientID={clientID} />
  </Modal>
  <Modal
    isOpen={isDeleteClientModalOpen}
    onRequestClose={closeDeleteClientModal}
    contentLabel="Delete Client"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <DeleteClientModal closeDeleteClientModal={closeDeleteClientModal} clientID={clientID} pppSecret={pppSecret} />
  </Modal>
  <Modal
    isOpen={isChangeClientProfileModalOpen}
    onRequestClose={closeChangeClientProfileModal}
    contentLabel="Change Client Plan"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <ChangeClientProfileModal closeChangeClientProfileModal={closeChangeClientProfileModal} selectedProfile={secret.profile} clientID={clientID} pppSecret={pppSecret} />
  </Modal>
  {ErrorModalComponent}
</div>

);
};

export default PPPClient;

