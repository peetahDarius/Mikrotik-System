import React, { useState } from 'react';
import apiFiles from '../apiFiles';
import ErrorModal from './ErrorModal';

const CreateRouter = ({ closeCreateRouterModal }) => {
    const [name, setName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [crtFile, setCertificate] = useState(null);
    const [keyFile, setKeyFile] = useState(null);
    const [error, setError] = useState('');

    const commands = [
        "/ip firewall filter add action=accept chain=input src-address=<server's-ip>",
        "/certificate add name=local-root-cert common-name=local-cert key-usage=key-cert-sign,crl-sign",
        "/certificate sign local-root-cert",
        "/certificate add name=webfig common-name=192.168.88.1",
        "/certificate sign webfig",
        "/ip service set www-ssl certificate=webfig disabled=no",
        "/certificate export-certificate webfig export-passphrase=<your-password>",
    ];

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        });
    };

    const handleCloseErrorModal = () => {
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('ip', ipAddress);
        formData.append('username', username);
        formData.append('password', password);
        if (crtFile) formData.append('certificate', crtFile);
        if (keyFile) formData.append('decrypted_key', keyFile);

        try {
            const response = await apiFiles.post('/api/router/', formData);
            if (response.status === 201) {
                closeCreateRouterModal();
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
            <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-xl h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-center text-indigo-600">Router Configuration</h2>
                    <button
                        onClick={closeCreateRouterModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">To get certificate and key files:</h3>
                    <div className="space-y-2">
                        {commands.map((command, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <code className="text-sm text-gray-800">{command}</code>
                                <button
                                    onClick={() => copyToClipboard(command)}
                                    className="text-indigo-600 text-sm hover:underline"
                                >
                                    Copy
                                </button>
                            </div>
                        ))}
                    </div>
                    <h3 className="text-md mx-2 my-2">Then go to files. Search for "cert_export_webfig.crt" and "cert_export_webfig.key" and download both of those files</h3>
                    <h3 className="text-md mx-2 my-2">Use openssl to decrypt the key and upload the decrypted key</h3>
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <code className="text-sm text-gray-800">openssl rsa -in cert_export_webfig.key -out decrypted_key.key</code>
                                <button
                                    onClick={() => copyToClipboard("openssl rsa -in cert_export_webfig.key -out decrypted_key.key")}
                                    className="text-indigo-600 text-sm hover:underline"
                                >
                                    Copy
                                </button>
                            </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Router Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">
                            IP Address
                        </label>
                        <input
                            type="text"
                            id="ipAddress"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
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
                    <div>
                        <label htmlFor="certificate" className="block text-sm font-medium text-gray-700">
                            Certificate File (cert_export_api-webfig.crt)
                        </label>
                        <input
                            type="file"
                            id="certificate"
                            onChange={(e) => setCertificate(e.target.files[0])}
                            className="block w-full mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="keyFile" className="block text-sm font-medium text-gray-700">
                            Key File (cert_export_api-webfig_decrypted.key)
                        </label>
                        <input
                            type="file"
                            id="keyFile"
                            onChange={(e) => setKeyFile(e.target.files[0])}
                            className="block w-full mt-1"
                            required
                        />
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

export default CreateRouter;
