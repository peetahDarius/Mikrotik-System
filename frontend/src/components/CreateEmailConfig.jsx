import React, { useState } from 'react';
import api from '../api';
import ErrorModal from './ErrorModal';

const CreateEmailConfig = ({ closeCreateEmailConfigModal }) => {
    const [emailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const [defaultConfig, setDefaultConfig] = useState(false);
    const [error, setError] = useState('');

    const handleCloseErrorModal = () => {
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email_host_user: emailUser,
            email_host_password: password,
            is_active: defaultConfig,
        };

        try {
            const response = await api.post('/api/emails/configurations/', data);
            if (response.status === 201) {
                closeCreateEmailConfigModal();
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const formattedError = Object.keys(errorData)
                    .map((key) => `${key}: ${errorData[key]}`)
                    .join(', ');

                setError(formattedError);
            } else {
                setError('Connection error.');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
            <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-center text-indigo-600">Email Configuration</h2>
                    <button
                        onClick={closeCreateEmailConfigModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="emailUser" className="block text-sm font-medium text-gray-700">
                            Email User
                        </label>
                        <input
                            type="text"
                            id="emailUser"
                            value={emailUser}
                            onChange={(e) => setEmailUser(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            App Password
                        </label>
                        <input
                            type="text"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="defaultConfig"
                            checked={defaultConfig}
                            onChange={(e) => setDefaultConfig(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="defaultConfig" className="ml-2 text-sm text-gray-700">
                            Set as Default
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {error && <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />}
        </div>
    );
};

export default CreateEmailConfig;
