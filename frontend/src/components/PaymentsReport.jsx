import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pie, Line } from "react-chartjs-2";
import Modal from 'react-modal';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import api from "../api";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import ResolvePayment from "../components/ResolveHotspotPayment";
import ViewHotspotPayments from "../components/ViewHotspotPayments";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

Modal.setAppElement('#root');

const PaymentsReport = () => {
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);
  const [reportData, setReportData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null); // Line chart state
  const [totalAmount, setTotalAmount] = useState(0); // Total amount state
  const [isResolvePaymentModalOpen, setIsResolvePaymentModalOpen] = useState(false);
  const [isViewHotspotPaymentsModalOpen, setIsViewHotspotPaymentsModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (timeFrom && timeTo) {
      try {
        const response = await api.post("/api/hotspot/report/payments/", {
          time_from: timeFrom.toISOString(),
          time_to: timeTo.toISOString(),
        });
        const timeResponse = await api.post(
          "/api/hotspot/report/payments/time/",
          {
            time_from: timeFrom.toISOString(),
            time_to: timeTo.toISOString(),
          }
        );
        setReportData(response.data);
        setChartData(formatChartData(response.data));
        setLineChartData(formatLineChartData(timeResponse.data));

        // Calculate total amount
        const total = Object.values(response.data).reduce(
          (acc, value) => acc + value,
          0
        );
        setTotalAmount(total); // Update total amount state
      } catch (error) {
        console.error("Error fetching payment report:", error);
      }
    }
  };
  const openResolvePaymentModal = () => setIsResolvePaymentModalOpen(true);
  const closeResolvePaymentModal = () => {
    setIsResolvePaymentModalOpen(false);
  };

  const openViewHotspotPaymentsModal = () => setIsViewHotspotPaymentsModalOpen(true);
  const closeViewHotspotPaymentsModal = () => {
    setIsViewHotspotPaymentsModalOpen(false);
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 40,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: Ksh ${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgba(${Math.floor(Math.random() * 255)}, 
                          ${Math.floor(Math.random() * 255)}, 
                          ${Math.floor(Math.random() * 255)}, 0.7)`;
      colors.push(color);
    }
    return colors;
  };

  const formatChartData = (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          label: "Total Amount",
          data: values,
          backgroundColor: generateColors(values.length),
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const formatLineChartData = (data) => {
    const timeLabels = Object.keys(data); // Time slots
    const packageNames = new Set(); // To collect unique package names

    // Collect all unique package names
    for (const timeSlot in data) {
      for (const packageName in data[timeSlot]) {
        packageNames.add(packageName);
      }
    }

    // Create datasets for each package
    const datasets = Array.from(packageNames).map((packageName) => {
      const packageData = timeLabels.map(
        (timeSlot) => data[timeSlot][packageName] || 0
      );
      return {
        label: packageName,
        data: packageData,
        fill: false,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 1)`,
        tension: 0.1,
      };
    });

    return {
      labels: timeLabels,
      datasets,
    };
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Payment Trend Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Payments",
        },
      },
    },
  };

  return (
    <div className="p-10 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
        {/* Time From Input */}
        <div className="flex items-center gap-4">
          <label className=" font-semibold text-gray-800">From</label>
          <DatePicker
            selected={timeFrom}
            onChange={(date) => setTimeFrom(date)}
            showTimeSelect
            dateFormat="Pp"
            className="border border-gray-300 rounded-lg p-2 w-[250px] text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
            placeholderText="Select Time From"
          />
        </div>

        {/* Time To Input */}
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-800">To</label>
          <DatePicker
            selected={timeTo}
            onChange={(date) => setTimeTo(date)}
            showTimeSelect
            dateFormat="Pp"
            className="border border-gray-300 rounded-lg p-2 w-[250px] text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
            placeholderText="Select Time To"
          />
        </div>

        {/* Submit Button */}
        <div className="flex-shrink-0">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 transform hover:scale-105"
            onClick={handleSubmit}
          >
            Generate Report
          </button>
        </div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none">
              Options
              <ChevronDownIcon className="w-5 h-5 text-white/60" />
            </Menu.Button>
          </div>
          <Menu.Items className="absolute right-0 w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openViewHotspotPaymentsModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  View Payments
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openResolvePaymentModal}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3`}
                >
                  Resolve Payment
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Table */}
      {Object.entries(reportData).length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">
            Report Summary
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Packages
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Amount (Ksh)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reportData).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Ksh {value.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap italic text-sm text-gray-700">
                  Total Amount
                </td>
                <td className="px-6 py-4 whitespace-nowrap italic text-sm text-gray-700">
                  Ksh {totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Chart Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-lg">
          {lineChartData && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
                Payment Trend Over Time
              </h3>
              <div className="relative h-[400px]">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/4 bg-white p-6 rounded-lg shadow-lg">
          {chartData && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
                Payment Breakdown
              </h3>
              <div className="relative h-[400px]">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isResolvePaymentModalOpen}
        onRequestClose={closeResolvePaymentModal}
        contentLabel="Resolve Payments"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ResolvePayment closeResolvePayment={closeResolvePaymentModal} />
      </Modal>
      <Modal
        isOpen={isViewHotspotPaymentsModalOpen}
        onRequestClose={closeViewHotspotPaymentsModal}
        contentLabel="View Hotspot payments"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ViewHotspotPayments closeViewHotspotPayments={closeViewHotspotPaymentsModal} />
      </Modal>
    </div>
  );
};

export default PaymentsReport;
