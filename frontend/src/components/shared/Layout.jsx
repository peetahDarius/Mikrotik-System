import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { HiMenuAlt1 } from 'react-icons/hi';
import classNames from 'classnames';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={classNames(
          'fixed inset-0 bg-neutral-900 z-40 transform transition-transform md:relative md:translate-x-0 md:flex',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            <HiMenuAlt1 size={24} />
          </button>
        </Header>

        {/* Main Content */}
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay for Sidebar in Mobile View */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
