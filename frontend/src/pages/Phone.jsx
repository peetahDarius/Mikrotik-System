import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../img/airnet-logo.png"
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { getConfig } from "../config";


const Phone = () => {
    const location = useLocation();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(null);
    const [message, setMessage] = useState("");  // To handle WebSocket messages
    const [paymentStatus, setPaymentStatus] = useState("");  // To show payment status
    const [startSocket, setStartSocket] = useState(false);

    const currentYear = new Date().getFullYear();

    const url = process.env.REACT_APP_BACKEND_HTTP_URL;
    // const url = getConfig("REACT_APP_BACKEND_URL");
    const item = location.state.item;
    const mac = location.state.mac;
    const apMac = location.state.apMac;

    const data = {
        item,
        mac,
        ap_mac: apMac,
        phone_number: phoneNumber
    };

    const handlePhoneInput = (e) => {
        const value = e.target.value;
        const onlyDigits = value.replace(/\D/g, ""); // Remove any non-digit characters
        setPhoneNumber(onlyDigits);
    };

    // WebSocket connection
    useEffect(() => {
        let ws;
        let timeoutId;

        if (startSocket) {
            ws = new WebSocket(`${url.replace('http', 'ws')}/ws/payment_status/${phoneNumber}/`);

            // Set a timeout to handle the case where no response is received
            timeoutId = setTimeout(() => {
                setLoading(false);
                setPaymentStatus('failed');
            }, 60000);

            ws.onmessage = (event) => {
                const resData = JSON.parse(event.data);
                setMessage(resData.message);

                // Clear the timeout if a response is received
                clearTimeout(timeoutId);

                switch (resData.message) {
                    case 'Payment successful':
                        setPaymentStatus('success');
                        setLoading(false);
                        break;
                    case 'Payment failed':
                        setPaymentStatus('failed');
                        setLoading(false);
                        break;
                    default:
                        setPaymentStatus('failed');
                        setLoading(false);
                        break;
                }
            };

            return () => {
                if (ws) {
                    ws.close();
                }
                // Clear the timeout if the component unmounts
                clearTimeout(timeoutId);
            };
        }
    }, [startSocket, phoneNumber, url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}api/hotspot/connect/`, JSON.stringify(data), {
                headers: { "Content-Type": "application/json" }
            });

            if (res.status === 202) {
                setStartSocket(true);  // Enable WebSocket connection
                setLoading(true);  // Start showing loading state
            }
        } catch (error) {
            setLoading(false);  // Ensure loading stops on error
        }
    };


    return (
        loading ? (
            <Loader />
        ) : paymentStatus === "success" ? (
        <div className="w-full max-w-md mx-auto mt-5 bg-white rounded-lg shadow-lg p-5 relative h-[750px]">
            <header className="flex justify-between gap-4 items-center bg-black text-white p-3">
                    <h4 className="text-lg font-bold">Data Yangu WiFi</h4>
                <div className="flex items-center space-x-2">
                    <a href="mailto:+254724907783" className="text-white">
                        <FaEnvelope />
                    </a>
                    <span>|</span>
                    <a href="tel:+254724907783" className="text-white">
                        <FaPhoneAlt />
                    </a>
                </div>
            </header>
            <div className="flex flex-row-reverse justify-between items-center mt-2">
                <p className="text-gray-700 text-center">
                    <strong>Need Help?</strong>
                    <br />
                    Contact us by: <a href="tel:+254724907783" className="text-blue-500 underline">+254724907783</a>
                </p>
                <img
                    src={Logo}
                    alt="Airnet Logo"
                    className="max-w-[50%] h-auto rounded-lg"
                />
            </div>
            <div className="mt-5">
                <hr />
            </div>
            <div className="h-[400px] flex flex-col justify-center items-center">
                <p className="text-center text-blue-800">
                    You are connected to Data Yangu WiFi.
                </p>
                <p className="text-center text-blue-800">
                    Enjoy seamless browsing & streaming without any interruptions
                </p>
                <p className="text-center text-blue-800">
                    Thank you for choosing Data Yangu WiFi
                </p>
                <button
                    onClick={() => window.location.href = 'http://www.google.com'}
                    className="bg-blue-600 text-white py-2 px-4 mt-5 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    <i className="fa fa-wifi mr-2"></i> Click Here to Start Browsing
                </button>
            </div>
            <footer className="absolute bottom-0 left-0 w-full bg-black text-white py-1">
                <p className="text-center text-xs">
                    &copy; {currentYear} Brooksys Technologies. All rights reserved.
                </p>
            </footer>
        </div>
    ) : paymentStatus === "failed" ?(
        <div className="w-full max-w-md mx-auto mt-5 bg-white rounded-lg shadow-lg p-5 relative h-[750px]">
            <header className="flex justify-between gap-4 items-center bg-black text-white p-3">
                    <h4 className="text-lg font-bold">Data Yangu WiFi</h4>
                <div className="flex items-center space-x-2">
                    <a href="mailto:+254724907783" className="text-white">
                        <FaEnvelope />
                    </a>
                    <span>|</span>
                    <a href="tel:+254724907783" className="text-white">
                        <FaPhoneAlt />
                    </a>
                </div>
            </header>
            <div className="flex flex-row-reverse justify-between items-center mt-2">
                <p className="text-gray-700 text-center">
                    <strong>Need Help?</strong>
                    <br />
                    Contact us by: <a href="tel:+254724907783" className="text-blue-600 underline">+254724907783</a>
                </p>
                <img
                    src={Logo}
                    alt="Airnet Logo"
                    className="max-w-[50%] h-auto rounded-lg"
                />
            </div>
            <div className="mt-5">
                <hr />
            </div>
            <div className="h-[400px] flex flex-col justify-center items-center">
                <p className="text-center text-blue-800">
                    Your Purchase has not been successful.
                </p>
                <p className="text-center text-blue-800">
                    Please try again later.
                </p>
                <p className="text-center text-blue-800">
                    Thank you for choosing Data Yangu WiFi
                </p>
            </div>
            <footer className="absolute bottom-0 left-0 w-full bg-black text-white py-1">
                <p className="text-center text-xs">
                    &copy; {currentYear} Brooksys Technologies. All rights reserved.
                </p>
            </footer>
        </div>
    ) : (
            <div className="w-full max-w-lg mx-auto mt-5 bg-white rounded-lg shadow-lg p-5 text-center">
            <header className="flex justify-between gap-4 items-center bg-black text-white p-3">
                    <h4 className="text-lg font-bold">Data Yangu WiFi</h4>
                <div className="flex items-center space-x-2">
                    <a href="mailto:+254724907783" className="text-white">
                        <FaEnvelope />
                    </a>
                    <span>|</span>
                    <a href="tel:+254724907783" className="text-white">
                        <FaPhoneAlt />
                    </a>
                </div>
            </header>

                <div className="flex flex-row-reverse justify-between items-center mt-3">
                    <p className="text-gray-600 text-center mt-6">
                        <strong>Need Help?</strong>
                        <br />
                        Contact us by:{" "}
                        <a href="tel:+254724907783" className="text-blue-500">
                            +254724907783
                        </a>
                    </p>
                    <img
                        src={Logo}
                        alt="Airnet Logo"
                        className="w-1/2 rounded-lg"
                    />
                </div>

                <div className="mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="border-2 border-blue-500 rounded-md p-5 mb-5 text-left">
                            <i className="fa fa-check-circle text-green-500 text-3xl"></i>
                            <p className="text-lg text-green-500 font-semibold my-3">
                                You're about to purchase 
                                {item.minutes / 60 === 1 ? ` ${item.minutes / 60}hr` : ` ${item.minutes / 60}hrs`} @ Ksh {item.amount} /=.
                            </p>
                            <p className="text-gray-600">
                                An STK push from M-Pesa will be sent to your phone. <br />
                                Please enter your PIN when prompted to complete your purchase.
                            </p>
                        </div>

                        <div className="mb-5 text-left">
                            <label
                                htmlFor="phone"
                                className="text-lg text-gray-700 block mb-2"
                            >
                                Enter your Phone number:{" "}
                                <br />
                                <small className="italic mt-2">
                                    <i className="fa fa-exclamation text-red-500"> ! </i> We currently
                                    only accept M-Pesa Payments. Please enter your M-Pesa number
                                </small>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                placeholder="e.g., 07XXXXXXXX"
                                className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                required
                                onChange={handlePhoneInput}
                                value={phoneNumber}
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="reset"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Purchase
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default Phone;

const Loader = () => (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid mb-4"></div>
        <p className="text-lg text-gray-700">Please wait... Checking for payment.</p>
    </div>
);
