import React, { useEffect, useState } from 'react';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from './WaveLoader';

const CreatePPPServer = ({ closeCreatePPPServerModal }) => {
    const [name, setName] = useState('');
    const [max_mtu, setMaxMtu] = useState(null);
    const [max_mru, setMaxMru] = useState(null);
    const [selectedInterface, setSelectedInterface] = useState('');
    const [interfaces, setInterfaces] = useState([]);
    const [loading, setLoading] = useState(null);
    const { handleError, ErrorModalComponent } = useErrorHandler();

    useEffect(() => {
        fetchInterfaces();
    }, []);

    const fetchInterfaces = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/interfaces/");
            const apiInterfaces = response.data
                .filter((singleInterface) => singleInterface["name"])
                .map((singleInterface) => singleInterface["name"]);
            setInterfaces(apiInterfaces);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name: name,
                interface: selectedInterface,
                max_mtu: max_mtu,
                max_mru: max_mru
            };
            const response = await api.post('/api/ppp/server/', JSON.stringify(data));
            console.log("The data: ", response.data);
    
            if (response.status === 201) {
                closeCreatePPPServerModal();
            }
        } catch (error) {
            handleError(error);
        }
    };

    return loading ? <WaveLoader /> : (
        <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
            <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-center text-indigo-600">Create PPP Server</h2>
                    <button
                        onClick={closeCreatePPPServerModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
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
                        <label htmlFor="interface" className="block text-sm font-medium text-gray-700">Interface</label>
                        <select
                            id="interface"
                            value={selectedInterface}
                            onChange={(e) => setSelectedInterface(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="">Select an interface</option>
                            {interfaces.map((interfaceName, index) => (
                                <option key={index} value={interfaceName}>
                                    {interfaceName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="max_mtu" className="block text-sm font-medium text-gray-700">Max MTU</label>
                        <input
                            type="number"
                            id="max_mtu"
                            value={max_mtu}
                            onChange={(e) => setMaxMtu(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="max_mru" className="block text-sm font-medium text-gray-700">Max MRU</label>
                        <input
                            type="number"
                            id="max_mru"
                            value={max_mru}
                            onChange={(e) => setMaxMru(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            {ErrorModalComponent}
        </div>
    );
};

export default CreatePPPServer;
