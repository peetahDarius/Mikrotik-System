import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import WaveLoader from "../components/WaveLoader";
import useErrorHandler from '../components/useErrorHandler.';
import { formatISO, subDays, format } from "date-fns";

const SentEmails = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [sortedEmails, setSortedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, ErrorModalComponent } = useErrorHandler();
  const [toTime, setToTime] = useState(formatISO(new Date())); // Current date and time
  const [fromTime, setFromTime] = useState(formatISO(subDays(new Date(), 1)));

  const fetchEmail = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/emails/sent-emails/", data);
      console.log(response.data)
      setEmails(response.data);
      setSortedEmails(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = {
        from_time: fromTime,  
        to_time: toTime

    }
    fetchEmail(data);
  }, []);

  const handleQuery = () => {
    const data = {
      from_time: timeFrom ? timeFrom.toISOString() : null,
      to_time: timeTo ? timeTo.toISOString() : null,
    };
    fetchEmail(data);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmails = sortedEmails.filter((email) =>
    email.message.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return loading ? (
    <WaveLoader />
  ) : (
    <div className="flex flex-col p-4">
      <div className="overflow-x-auto sm:overflow-visible">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-3">
          <div className="shadow overflow-hidden border-b border-neutral-700 sm:rounded-lg">
            <div className="flex flex-row justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-4">
                <DatePicker
                  selected={timeFrom}
                  onChange={(date) => setTimeFrom(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Time From"
                  className="px-4 py-2 text-sm border border-neutral-600 rounded-lg"
                />
                <DatePicker
                  selected={timeTo}
                  onChange={(date) => setTimeTo(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Time To"
                  className="px-4 py-2 text-sm border border-neutral-600 rounded-lg"
                />
              </div>
              <button
                onClick={handleQuery}
                className="py-2 px-4 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200"
              >
                Query
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search Message"
                className="flex-grow px-4 py-2 text-sm border border-neutral-600 rounded-lg"
                style={{ width: "20rem" }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-800">
                  <tr>
                    {[
                      { label: "ID", field: "id" },
                      { label: "Time Sent", field: "created_at" },
                      { label: "Recipient", field: "numbers" },
                      { label: "Message", field: "message" },
                    ].map((col) => (
                      <th
                        key={col.field}
                        className="px-3 py-3 text-xs font-medium text-neutral-300 uppercase tracking-wider text-left cursor-pointer"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmails.map((email) => (
                    <tr
                      key={email.id}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-3 py-4 text-sm text-gray-500">{email.id}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{format(new Date(email.created_at), 'eee MMM dd yyyy HH:mm')}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{
                        email.length > 1 ? `${email.length} clients` :
                      JSON.parse(email.recipient_list.replace(/'/g, '"'))
                       }</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{email.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {ErrorModalComponent}
    </div>
  );
};

export default SentEmails;
