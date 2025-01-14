import React, { useEffect, useState } from "react";
import { FaEdit, FaSortUp, FaSortDown } from "react-icons/fa"; // Add sorting icons
import Modal from "react-modal";
import EditActiveDevices from "../components/EditActiveDevices";
import api from "../api";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import UnblockGuest from "../components/UnblockGuest";
import WaveLoader from "../components/WaveLoader";
import { getConfig } from "../config";

const ActiveDevices = () => {
  const [isEditActiveDevicesModalOpen, setIsEditActiveDevicesModalOpen] =
    useState(false);
  const [selectedActiveDevices, setSelectedActiveDevices] = useState(null);
  const [isUnblockGuestModalOpen, setIsUnblockGuestModalOpen] =
    useState(false);

  const [devices, setDevices] = useState([]);
  const [aps, setAps] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    fetchAPs();
  }, []);

  useEffect(() => {
    // Establish WebSocket connection
    const websocketURL = process.env.REACT_APP_WEBSOCKET_URL
    // const websocketURL = getConfig("REACT_APP_WEBSOCKET_URL")
    const socket = new WebSocket(`${websocketURL}active-devices/`);
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);
      } else {
        setDevices(data); // Update the devices state
      }
    };
    socket.onclose = function () {
      // console.error("WebSocket closed unexpectedly");
    };

    return () => {
      socket.close();
    };
  }, []);

  const fetchAPs = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/hotspot/access-points-mac/");
      setAps(response.data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const openEditActiveDevicesModal = (device) => {
    setSelectedActiveDevices(device);
    setIsEditActiveDevicesModalOpen(true);
  };

  const closeEditActiveDevicesModal = () => {
    setIsEditActiveDevicesModalOpen(false);
    setSelectedActiveDevices(null);
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedDevices = [...devices].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key] || "";
      const valueB = b[sortConfig.key] || "";
      if (sortConfig.direction === "ascending") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    }
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    }
    return null;
  };

  const openUnblockGuestModal = () => setIsUnblockGuestModalOpen(true);
  const closeUnblockGuestModal = () => {
    setIsUnblockGuestModalOpen(false);
  };

  return (
    loading ? <WaveLoader /> : (
      <div className="flex flex-col max-h-screen bg-gray-100 p-4">
        <div className="flex justify-end mb-4">
          {" "}
          {/* Wrap the button in a flex container */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none">
                Options
                <ChevronDownIcon className="w-5 h-5 text-white/60" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openUnblockGuestModal}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                  >
                    Unblock guest
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        <div className="w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Hotspot/Clients
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("essid")}
                  >
                    ESSID {getSortIcon("essid")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("hostname")}
                  >
                    Name {getSortIcon("hostname")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("mac")}
                  >
                    Mac {getSortIcon("mac")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("ap_mac")}
                  >
                    AP Mac {getSortIcon("ap_mac")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("ip")}
                  >
                    IP Address {getSortIcon("ip")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("signal")}
                  >
                    Signal {getSortIcon("signal")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("noise")}
                  >
                    Noise {getSortIcon("noise")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("authorized")}
                  >
                    Authorized {getSortIcon("authorized")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDevices.map((device, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.essid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.hostname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.mac}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {aps.find((ap) => ap.mac === device.ap_mac)?.name ||
                        device.ap_mac}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.signal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.noise}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {String(device.authorized)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditActiveDevicesModal(device)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={isEditActiveDevicesModalOpen}
          onRequestClose={closeEditActiveDevicesModal}
          contentLabel="Edit ActiveDevices"
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
        >
          {selectedActiveDevices && (
            <EditActiveDevices
              closeEditActiveDevicesModal={closeEditActiveDevicesModal}
              device={selectedActiveDevices}
            />
          )}
        </Modal>
        <Modal
          isOpen={isUnblockGuestModalOpen}
          onRequestClose={closeUnblockGuestModal}
          contentLabel="Resolve Payments"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <UnblockGuest closeUnblockGuest={closeUnblockGuestModal} />
        </Modal>
      </div>
    )
  );
};

export default ActiveDevices;
