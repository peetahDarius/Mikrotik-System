import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "./SuccessModal";
import api from "../api";
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from "./WaveLoader";

const CreateNewService = ({
  closeCreateNewService,
  selectedProfile,
  clientID,
}) => {
  const [pppProfiles, setPppProfiles] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(null);
  const [pppClients, setPPPClients] = useState([]);
  const [dhcpClients, setDHCPClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [networks, setNetworks] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [availableIps, setAvailableIPs] = useState([])
  const { handleError, ErrorModalComponent } = useErrorHandler();
  const [disabled, setDisabled] = useState(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get("/api/ppp/profiles/");
        setPppProfiles(response.data);
      } catch (error) {
        handleError(error);      }
    };

    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await api.get("api/static/packages/");
        console.log(response.data);
        setPackages(response.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrefix = async () => {
      try {
        const response = await api.get("api/payments/credentials/");
        if (response.status !== 200) {
          throw new Error(response.data);
        }
        setPrefix(response.data[0].acc_no_prefix);
      } catch (error) {
        handleError(error);      }
    };

    const fetchPPPClients = async () => {
      setLoading(true);
      try {
        const response = await api.get("api/clients/ppp/");
        if (response.status === 200) {
          setPPPClients(response.data);
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDHCPClients = async () => {
      setLoading(true);
      try {
        const response = await api.get("api/clients/dhcp/");
        if (response.status === 200) {
          setDHCPClients(response.data);
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNetworks = async () => {
      setLoading(true);
      try {
        const response = await api.get("api/dhcp/networks/");
        setNetworks(response.data.map((network) => network.address));
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPPPClients();
    fetchDHCPClients();
    // fetchPrefix()
    fetchProfiles();
    fetchPackages();
    fetchNetworks();
  }, []);

  useEffect(() => {
    const fetchAvailableIPs = async () => {
      if (selectedNetwork) {
        try {
          const data = {
            subnet: selectedNetwork
          }
          const response = await api.post("api/dhcp/ip/available/", data)
          setAvailableIPs(response.data)
        } catch (error) {
          handleError(error);        }
      }
    }
    fetchAvailableIPs();
  }, [selectedNetwork])

  const generateUsername = () => {
    const nextClientsID =
      pppClients.length === 0 ? 1 : pppClients[pppClients.length - 1].id + 1;
    const newUsername = `PPP${zfill(nextClientsID, 5)}`;
    return newUsername;
  };
  const generateDHCPUsername = () => {
    const nextClientsID =
      dhcpClients.length === 0 ? 1 : dhcpClients[dhcpClients.length - 1].id + 1;
    const newUsername = `STA${zfill(nextClientsID, 5)}`;
    return newUsername;
  };

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  function zfill(number, width) {
    return String(number).padStart(width, "0");
  }

  const handleSaveClick = async () => {
    setDisabled(true);
    if (selectedServiceType === "pppoe") {
      generateUsername();
      // Generate username and password
      const newUsername = generateUsername();
      const newPassword = generateRandomString(12);

      // // Prepare data to send to the backend
      const data = {
        client: clientID,
        username: newUsername,
        password: newPassword,
        profile: selectedPlan,
      };

      try {
        console.log(data);
        const response = await api.post(
          "/api/clients/ppp/",
          JSON.stringify(data)
        );
        if (response.status === 201) {
          setShowSuccessModal(true);
        }
      } catch (error) {
        handleError(error);      
      } finally {
        setDisabled(false)
      }
    } else {
      const name = generateDHCPUsername();
      const data = {
        client: clientID,
        ip_address: ipAddress,
        package: selectedPackage,
        name: name,
        network: selectedNetwork
      };

      try {
        const response = await api.post("api/clients/dhcp/", data);
        if (response.status === 201) {
          setShowSuccessModal(true);
        }
      } catch (error) {
        handleError(error);      
      } finally {
        setDisabled(false)
      }
    }
  };

  return (
    loading ? <WaveLoader /> : (
      <div className="fixed inset-0 z-50 flex items-start justify-center">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50"
          onClick={closeCreateNewService}
        ></div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faTimes}
              className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
              onClick={closeCreateNewService}
              title="Close"
            />
            <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">
              Create client's service
            </h2>
          </div>

          <div className="mb-4">
            {/* Service Type Selection */}
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="" disabled>
                Select Service Type
              </option>
              <option value="pppoe">PPPoE</option>
              <option value="dhcp">DHCP</option>
            </select>
          </div>

          {/* Conditionally render PPP profiles dropdown based on service type */}
          {selectedServiceType === "pppoe" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                PPP Profile
              </label>
              <select
                value={selectedPlan}
                required
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="" selected disabled>Select PPPoE profile</option>
                {pppProfiles.map((profile) => (
                  <option key={profile[".id"]} value={profile.name}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedServiceType === "dhcp" && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Package
                </label>
                <select
                  value={selectedPackage}
                  required
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                >
                  <option value="" selected disabled>Select internet package</option>
                  {packages.map((staticpackage) => (
                    <option
                      key={staticpackage["id"]}
                      value={staticpackage.name}
                    >
                      {staticpackage.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Network
                </label>
                <select
                  value={selectedNetwork}
                  required
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                >
                  <option value="" selected disabled >Select network subnet</option>
                  {networks.map((network, index) => (
                    <option
                      key={index}
                      value={network}
                    >
                      {network}
                    </option>
                  ))}
                </select>
              </div>
              {availableIps.length !== 0 && <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  IP Address
                </label>
                <select
                  value={ipAddress}
                  required
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                >
                  <option value="" selected disabled>IP Address</option>
                  {availableIps.map((ip, index) => (
                    <option
                      key={index}
                      value={ip}
                    >
                      {ip}
                    </option>
                  ))}
                </select>
              </div>}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            {disabled ? 
            <button
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Creating
          </button> :
          <button
          onClick={handleSaveClick}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Create
        </button>
            }
            <button
              onClick={closeCreateNewService}
              className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
        {showSuccessModal && (
          <SuccessModal
            isVisible={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              closeCreateNewService();
            }}
            message="Client's service created successfully!"
          />
        )}
        {ErrorModalComponent}
      </div>
    )
  );
};

export default CreateNewService;
