import React, { useState } from 'react';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FcBullish } from 'react-icons/fc';
import { HiOutlineLogout, HiMenu, HiX } from 'react-icons/hi';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants';

const linkClass =
  'flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all duration-200 ease-in-out rounded-md';

function SidebarLink({ link }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={link.path}
      className={classNames(
        pathname === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-300',
        linkClass
      )}
    >
      <span className="text-lg">{link.icon}</span>
      {link.label}
    </Link>
  );
}

function SidebarDropdownLink({ link, isOpen, toggleDropdown }) {
  const { pathname } = useLocation();

  return (
    <div>
      <div
        onClick={toggleDropdown}
        className={classNames(
          pathname === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-300',
          linkClass
        )}
      >
        <span className="text-lg">{link.icon}</span>
        {link.label}
      </div>
      {isOpen && (
        <div className="pl-6 ml-2 mt-2 space-y-2 overflow-y-auto max-h-48">
          {link.subkeys.map((subLink) => (
            <Link
              key={subLink.key}
              to={subLink.path}
              className={classNames(
                pathname === subLink.path ? 'bg-neutral-700 text-white' : 'text-neutral-300',
                linkClass
              )}
            >
              {subLink.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (key) => {
    if (openDropdown === key) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(key);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-3 text-white bg-neutral-900 fixed top-4 left-4 z-50 rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <HiMenu fontSize={24} />
      </button>

      {/* Sidebar */}
      <div
        className={classNames(
          'bg-neutral-900 w-56 p-4 flex flex-col fixed z-40 h-full transition-all transform overflow-hidden', // Reduced width from w-64 to w-56
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0 md:block shadow-2xl'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 mb-6">
          <FcBullish fontSize={28} />
          <span className="text-neutral-200 text-xl font-semibold">MikroTik API</span>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col flex-1 gap-3 overflow-y-auto">
          {DASHBOARD_SIDEBAR_LINKS.map((link) =>
            link.subkeys.length === 0 ? (
              <SidebarLink key={link.key} link={link} />
            ) : (
              <SidebarDropdownLink
                key={link.key}
                link={link}
                isOpen={openDropdown === link.key}
                toggleDropdown={() => toggleDropdown(link.key)}
              />
            )
          )}
        </div>

        {/* Fixed Bottom Links */}
        <div className="mt-auto pt-4 pb-6">
          <div className="py-4 border-t border-neutral-700">
            {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
              <SidebarLink key={link.key} link={link} />
            ))}
            <div
              className={classNames(linkClass, 'cursor-pointer text-red-500 hover:bg-neutral-700')}
              onClick={() => navigate('/logout')}
            >
              <span className="text-lg">
                <HiOutlineLogout />
              </span>
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Close Button for Mobile Sidebar */}
      <button
        className="md:hidden absolute top-4 right-4 text-white"
        onClick={() => setIsSidebarOpen(false)}
      >
        <HiX fontSize={24} />
      </button>
    </>
  );
}
