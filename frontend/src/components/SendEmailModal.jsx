import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "../components/SuccessModal";
import api from "../api";
import useErrorHandler from "./useErrorHandler.";

const SendEmailModal = ({ closeSendEmailModal, email }) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const { handleError, ErrorModalComponent } = useErrorHandler();

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await api.get("api/emails/configurations/");
      setEmailList(response.data);
    } catch (error) {
        handleError(error);
    }
  };

  const handleSendClick = async () => {
    const recipient_list = Array.isArray(email) ? email : [email];

    const data = {
      recipient_list: recipient_list,
      message: message,
      from_email: selectedEmail,
      subject: subject,
    };
    console.log(data)
    try {
      const response = await api.post(
        "/api/emails/send/",
        JSON.stringify(data)
      );

      if (response.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (error) {
        handleError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50"
        onClick={closeSendEmailModal}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mt-10 transform transition-transform duration-300">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faTimes}
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all duration-300"
            onClick={closeSendEmailModal}
            title="Close"
          />
          <h2 className="text-xl flex-1 font-semibold text-blue-900 text-center">
            Send Email
          </h2>
        </div>
        <div className="mb-4">
          <label
            htmlFor="emailSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Email:
          </label>
          <select
            required
            id="emailSelect"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          >
            <option selected disabled value="">Select From Email</option>
            {emailList.map((emailAddr) => (
              <option key={emailAddr.id} value={emailAddr["email_host_user"]}>
                {emailAddr["email_host_user"]}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject:
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter email subject..."
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message:
          </label>
          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Type your message here..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSendClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Send
          </button>
          <button
            onClick={closeSendEmailModal}
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
          closeSendEmailModal();
        }}
        message="Email sent successfully!"
      />
       {ErrorModalComponent}
    </div>
  );
};

export default SendEmailModal;
