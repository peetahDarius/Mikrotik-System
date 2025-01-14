import React, { useEffect, useState } from 'react';
import api from '../api';
import axios from "axios"
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from "../img/airnet-logo.png"
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { getConfig } from "../config";

const StaticPage = () => {

    const [newPackages, setNewPackages] = useState([])
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(null)
    const [mac, setMac] = useState(null);
    const [apMac, setApMac] = useState(null);
    
    const location = useLocation();
    const navigate = useNavigate()

    const url = process.env.REACT_APP_BACKEND_HTTP_URL
    // const url = getConfig("REACT_APP_BACKEND_URL")
    useEffect(() =>{
        const queryParams = new URLSearchParams(location.search);
        const macParam = queryParams.get("id");
        const apMacParam = queryParams.get("ap");

        setMac(macParam);
        setApMac(apMacParam);

        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${url}api/hotspot/packages/`)
            setNewPackages(res.data)
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

  // Function to display the correct divs based on checkbox
  const showDivs = (selectedClass) => {
    setSelectedPlan(selectedClass);
    const form = document.getElementById('packages');
    
    if (form) {
      // Adding setTimeout to give time for mobile layout to adjust before scrolling
      setTimeout(() => {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };
  
  // Function to handle checkbox uncheck and hide all divs
  const handleCheckboxChange = (plan) => {
    if (selectedPlan === plan) {
      setSelectedPlan(null); // Uncheck and hide all if clicked again
    } else {
      showDivs(plan);
    }
  };

  const handleSubmit = (item) => {
    navigate("/phone", {state: {item, mac, apMac }})
  }

  return !loading && (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 mt-5">
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

      <div className="flex flex-row-reverse justify-between items-center mt-4">
        <p className="text-left text-gray-600 text-sm">
          <strong>Need Help?</strong>
          <br />
          Contact us by: <a href="tel:+254724907783" className="text-blue-500 underline">+254724907783</a>
        </p>
        <img
          src={Logo}
          alt="Airnet logo"
          className="max-w-[50%] rounded-lg"
        />
      </div>

      <div className="mt-6">
        <div className="border-2 border-blue-500 rounded-md p-4 mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="daily"
              className="w-5 h-5 border border-blue-800 rounded focus:ring-0"
              checked={selectedPlan === 'daily'}
              onChange={() => handleCheckboxChange('daily')}
            />
            <label htmlFor="daily" className="text-gray-700">Daily</label>
          </div>
        </div>

        <div className="border-2 border-blue-500 rounded-md p-4 mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="weekly"
              className="w-5 h-5 border border-blue-800 rounded focus:ring-0"
              checked={selectedPlan === 'weekly'}
              onChange={() => handleCheckboxChange('weekly')}
            />
            <label htmlFor="weekly" className="text-gray-700">Weekly</label>
          </div>
        </div>

        <div className="border-2 border-blue-500 rounded-md p-4 mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="monthly"
              className="w-5 h-5 border border-blue-800 rounded focus:ring-0"
              checked={selectedPlan === 'monthly'}
              onChange={() => handleCheckboxChange('monthly')}
            />
            <label htmlFor="monthly" className="text-gray-700">Monthly</label>
          </div>
        </div>
      </div>

      <div className="mt-6" id="packages">
        {newPackages.map((item) => {
            
          const hours = item.minutes / 60;
          const cost = item.amount;
          const packageName = item.name
          const byte_quota = item.byte_quota
        
          if (hours >= 720 && selectedPlan === 'monthly') {
            return (
              <div key={item.id} className="relative bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-blue-500 text-lg mb-2">
                  {packageName}
                </h3>
                <p className="text-gray-600 mb-4">{Math.floor(hours / 24)} days @ Ksh{cost}</p>
                <input type="hidden" name="hours" value={hours} />
                <button
                  type="submit"
                  name="cost"
                  value={cost}
                  className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => handleSubmit(item)}
                >
                  Buy
                </button>
              </div>
            );
          }

          if (hours > 24 && hours < 720 && selectedPlan === 'weekly') {
            return (
              <div key={item.id}  className="relative bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-blue-500 text-lg mb-2">
                  {packageName}
                </h3>
                <p className="text-gray-600 mb-4">{Math.floor(hours / 24)} days @ Ksh{cost}</p>
                <input type="hidden" name="hours" value={hours} />
                <button
                  type="submit"
                  name="cost"
                  value={cost}
                  className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => handleSubmit(item)}
                >
                  Buy
                </button>
              </div>
            );
          }

          if (hours <= 24 && selectedPlan === 'daily') {
            if (!hours) {
              return (
                <div key={item.id} className="relative bg-white p-4 rounded-lg shadow-md mb-4">
                  <h3 className="text-blue-500 text-lg mb-2">
                    {hours === 1 ? '1 Hour' : `${packageName}`}
                  </h3>
                  <p className="text-gray-600 mb-4 italic">
                    {byte_quota ? "Enjoy Seamless Browsing for:" : "Enjoy Unlimited Browsing for:"}
                    
                  </p>
                  <p className="text-gray-600 mb-4">
                    {byte_quota > 1024 ?`${byte_quota/1024} GBs @ Ksh${cost}` : `${byte_quota} MBs @ Ksh${cost}`}
                  </p>
                  <input type="hidden" name="hours" value={hours} />
                  <button
                    type="submit"
                    name="cost"
                    value={cost}
                    className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() => handleSubmit(item)}
                  >
                    Buy
                  </button>
                </div>
              )
            } else {
            return (
              <div key={item.id} className="relative bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-blue-500 text-lg mb-2">
                  {hours === 1 ? '1 Hour' : `${packageName}`}
                </h3>
                <p className="text-gray-600 mb-4 italic">
                {byte_quota ? "Enjoy Seamless Browsing for:" : "Enjoy Unlimited Browsing for:"}
                </p>
                <p className="text-gray-600 mb-4">
                  {hours === 1 ? `${hours} Hr @ Ksh${cost}` : `${hours} Hrs @ Ksh${cost}`}
                </p>
                <input type="hidden" name="hours" value={hours} />
                <button
                  type="submit"
                  name="cost"
                  value={cost}
                  className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => handleSubmit(item)}
                >
                  Buy
                </button>
              </div>
            );}
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default StaticPage;
