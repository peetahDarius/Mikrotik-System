import React, { useState, useEffect } from 'react';
import api from '../api';
import useErrorHandler from '../components/useErrorHandler.';
import WaveLoader from '../components/WaveLoader';

const SMSConfig = () => {
  const [tags, setTags] = useState({
    createClient: [],
    createService: [],
    clientNearDue: [],
    clientSuspended: [],
    paymentReceived: [],
    activateService: [],
  });

  const [messages, setMessages] = useState({
    createClient: '',
    createService: '',
    clientNearDue: '',
    clientSuspended: '',
    paymentReceived: '',
    activateService: ''
  });

  const [credentials, setCredentials] = useState({
    user_id: '',
    sender_id: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [createClientTags, createServiceTags, clientNearDueTags, clientSuspendedTags, paymentReceivedTags, activateServiceTags] = await Promise.all([
          api.get('api/send-sms/create-client-options/'),
          api.get('api/send-sms/create-service-options/'),
          api.get('api/send-sms/near-due-options/'),
          api.get('api/send-sms/suspended-options/'),
          api.get('api/send-sms/payment-received-options/'),
          api.get('api/send-sms/activate-service-options/')
        ]);

        setTags({
          createClient: createClientTags.data.options || [],
          createService: createServiceTags.data.options || [],
          clientNearDue: clientNearDueTags.data.options || [],
          clientSuspended: clientSuspendedTags.data.options || [],
          paymentReceived: paymentReceivedTags.data.options || [],
          activateService: activateServiceTags.data.options || [],
        });
      } catch (error) {
        handleError(error);
      }
    };

    const fetchMessages = async () => {
      try {
        const [createClientMessage, createServiceMessage, clientNearDueMessage, clientSuspendedMessage, paymentReceivedMessage, activateServiceMessage] = await Promise.all([
          api.get('api/send-sms/create-client/'),
          api.get('api/send-sms/create-service/'),
          api.get('api/send-sms/near-due/'),
          api.get('api/send-sms/suspended/'),
          api.get('api/send-sms/payment-received/'),
          api.get('api/send-sms/activate-service/')
        ]);

        setMessages({
          createClient: createClientMessage.data[0]?.message ?? '',
          createService: createServiceMessage.data[0]?.message ?? '',
          clientNearDue: clientNearDueMessage.data[0]?.message ?? '',
          clientSuspended: clientSuspendedMessage.data[0]?.message ?? '',
          paymentReceived: paymentReceivedMessage.data[0]?.message ?? '',
          activateService: activateServiceMessage.data[0]?.message ?? ''
        });
      } catch (error) {
        handleError(error);
      }
    };

    const fetchCredentials = async () => {
      try {
        const { data } = await api.get('api/send-sms/credentials/');
        setCredentials({
          user_id: data[0].user_id || '',
          sender_id: data[0].sender_id || '',
          password: data[0].password || ''
        });
        setLoading(false);
      } catch (error) {
        handleError(error);
        setLoading(false);
      }
    };

    fetchTags();
    fetchMessages();
    fetchCredentials();
  }, []);

  const handleChange = (event, key) => {
    setMessages({
      ...messages,
      [key]: event.target.value
    });
  };

  const handleTagClick = (tag, key) => {
    setMessages({
      ...messages,
      [key]: `${messages[key]} ${tag}`
    });
  };

  const handleSubmit = async (key, path) => {
    try {
      await api.post(`api/send-sms/${path}/`, { message: messages[key] });
      alert(`${key} message saved successfully!`);
    } catch (error) {
      handleError(error);
      // alert(`Failed to save ${key} message.`);
    }
  };

  const handleCredentials = async () => {
    try {
      await api.post('api/send-sms/credentials/', credentials);
      alert('SMS Credentials saved successfully!');
    } catch (error) {
      handleError(error);
      // alert('Failed to save SMS Credentials.');
    }
  };

  const handleCredentialsChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value
    });
  };

  if (loading) {
    return <WaveLoader />;
  }

  return (
    <div className="p-6 space-y-8 bg-white shadow-lg rounded-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">SMS Configurations</h1>

      {/* SMS Credentials Form */}
      <div className="p-6 bg-gray-100 border border-gray-200 rounded-lg space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">SMS Credentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">User ID</label>
            <input
              type="text"
              name="user_id"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.user_id}
              onChange={handleCredentialsChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Sender ID</label>
            <input
              type="text"
              name="sender_id"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.sender_id}
              onChange={handleCredentialsChange}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="text"
              name="password"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.password}
              onChange={handleCredentialsChange}
            />
          </div>
        </div>
        <button
          type="button"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleCredentials}
        >
          Save SMS Credentials
        </button>
      </div>

      {/* SMS Messages Form */}
      <div className="space-y-6">
        {[
          { title: 'Payment Received SMS', key: 'paymentReceived', path: 'payment-received'},
          { title: 'Activate service SMS', key: 'activateService', path: 'activate-service'},
          { title: 'Suspended Client SMS', key: 'clientSuspended', path: 'suspended' },
          { title: 'Client Near Due SMS', key: 'clientNearDue', path: 'near-due' },
          { title: 'Create Client SMS', key: 'createClient', path: 'create-client' },
          { title: 'Create Service SMS', key: 'createService', path: 'create-service'}
        ].map(({ title, key, path }) => (
          <div key={key} className="p-6 bg-gray-100 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
            <textarea
              className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
              value={messages[key]}
              onChange={(e) => handleChange(e, key)}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags[key].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => handleTagClick(tag, key)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="py-2 px-4 mt-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleSubmit(key, path)}
            >
              Save {title}
            </button>
          </div>
        ))}
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default SMSConfig;
