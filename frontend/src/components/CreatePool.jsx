
import React, { useState } from 'react';
import api from '../api'


const CreatePool = ({ closeCreatePoolModal }) => {
    const [name, setName] = useState('');
    const [ipPool, setIpPool] = useState('');

    const handleSubmit = async (e) => {
        const data = {
            name: name,
            ip_pool: ipPool
        }
        e.preventDefault();
        const response = await api.post('/api/pool/', JSON.stringify(data))
        console.log("The data: ", response.data)
        
        if (response.status === 201) {
            closeCreatePoolModal();
        }
    }; 

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50 z-50">
       <div className="w-full p-8 space-y-6 bg-white shadow-md rounded-lg max-w-sm h-screen">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-center text-indigo-600">Add IP Pool</h2>
                 <button
                        onClick={closeCreatePoolModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
                        <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">Pool Range</label>
                        <input
                            type="text"
                            id="ipPool"
                            value={ipPool}
                            onChange={(e) => setIpPool(e.target.value)}
                            placeholder='192.160.88.1/24 or 192.168.88.5-192.168.88.20'
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
    </div>
  );
};

export default CreatePool;

