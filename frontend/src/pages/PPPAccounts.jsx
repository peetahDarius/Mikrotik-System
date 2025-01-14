import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import NewPPPAccount from './NewPPPAccount'; // Adjust the import path accordingly
import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';
import mikrotikApi from '../mikrotikApi';
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const PPPAccounts = () => {
  const navigate = useNavigate()
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeConnections, setActiveConnections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    const fetchSecrets = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/ppp-clients/');
        console.log("the clients rsponse is: ", response.data)
        setSecrets(response.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false)
      }
    };

    // const fetchActiveConnections = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await mikrotikApi.get('/api/rest/ppp/active', {
    //     });
    //     setActiveConnections(response.data);
    //   } catch (error) {
    //     console.error('Error fetching PPP profiles:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchSecrets();
    // fetchActiveConnections();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return loading ? <WaveLoader /> : (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className='flex flex-row float-right  my-4 gap-5 mx-5'>
            <select className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500">
              <option value="" disabled selected className='text-center'>Actions</option>
              <option value="">Send SMS</option>
              <option value="">Import Clients</option>
              <option value="">Export Clients</option>
            </select>
            <button onClick={openModal} className="w-full py-1 px-2 border bg-blue-300 border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"> Add New Client </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Password
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Profile
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Online
                  </th>
                  
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {
                  secrets.map(secret => (
                    <tr key={secret.id} className='cursor-pointer hover:bg-gray-100' onClick={() => navigate('/client', {state: {clientID: secret.id}})}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{secret.custom_id}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{secret.first_name} {secret.last_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{secret.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{secret.phone}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{secret.username}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{secret.password}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {secret.profile}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {secret.disabled ?
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            Offline
                          </span> :
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Online
                          </span>
                        }
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {secret.disabled ?
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Disabled
                          </span> :
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Enabled
                          </span>
                        }
                      </td>
                      
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add New PPP Account"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <NewPPPAccount closeModal={closeModal} />
      </Modal>
      {ErrorModalComponent}
    </div>
  );
}

export default PPPAccounts;
