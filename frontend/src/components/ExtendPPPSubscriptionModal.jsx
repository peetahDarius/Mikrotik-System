import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessModal from './SuccessModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api';
import useErrorHandler from "./useErrorHandler.";
import WaveLoader from './WaveLoader';

const ExtendPPPSubscriptionModal = ({ closeExtendPPPSubscriptionModal, serviceID }) => {
    const [newEndDate, setNewEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { handleError, ErrorModalComponent } = useErrorHandler();

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/clients/ppp/${serviceID}/`);
                const endDateStr = res.data.suspension_date;
                const endDate = new Date(endDateStr);
                
                if (!isNaN(endDate)) {
                    setNewEndDate(endDate);
                } else {
                    console.error('Invalid date format from API:', endDateStr);
                }
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [serviceID]);

    const handleSaveClick = async () => {
        if (!newEndDate) return;
        const data = {suspension_date: newEndDate}
        try {
            const response = await api.patch(`/api/clients/ppp/${serviceID}/`, JSON.stringify(data));
            if (response.status === 200) {
                setShowSuccessModal(true);
            }
        } catch (error) {
            handleError(error);        }
    };

    return loading ? <WaveLoader /> : (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={closeExtendPPPSubscriptionModal}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 transform transition-transform duration-300">
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
                        onClick={closeExtendPPPSubscriptionModal}
                        title="Close"
                    />
                    <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">Extend Subscription</h2>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Select New Expiry Date and Time:</label>
                    <DatePicker
                        selected={newEndDate}
                        onChange={(date) => setNewEndDate(date)}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd h:mm aa"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleSaveClick}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                        Save
                    </button>
                    <button
                        onClick={closeExtendPPPSubscriptionModal}
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <SuccessModal
                isVisible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    closeExtendPPPSubscriptionModal();
                }}
                message="Subscription extended successfully!"
            />
            {ErrorModalComponent}
        </div>
    );
};

export default ExtendPPPSubscriptionModal;
