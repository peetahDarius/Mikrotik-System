import React from 'react';
import Modal from 'react-modal';

const PPPProfileModal = ({ isOpen, onRequestClose, profile }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="PPP Profile Details"
      className="modal"
      overlayClassName="modal-overlay"
    >
      {profile && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Profile Details: {profile.name}</h2>
          <div className="mb-2"><strong>ID:</strong> {profile['.id']}</div>
          <div className="mb-2"><strong>Address List:</strong> {profile['address-list']}</div>
          <div className="mb-2"><strong>Bridge Learning:</strong> {profile['bridge-learning']}</div>
          <div className="mb-2"><strong>Change TCP MSS:</strong> {profile['change-tcp-mss']}</div>
          <div className="mb-2"><strong>Default:</strong> {profile['default']}</div>
          <div className="mb-2"><strong>Idle Timeout:</strong> {profile['idle-timeout']}</div>
          <div className="mb-2"><strong>Local Address:</strong> {profile['local-address']}</div>
          <div className="mb-2"><strong>On Down:</strong> {profile['on-down']}</div>
          <div className="mb-2"><strong>On Up:</strong> {profile['on-up']}</div>
          <div className="mb-2"><strong>Only One:</strong> {profile['only-one']}</div>
          <div className="mb-2"><strong>Rate Limit:</strong> {profile['rate-limit']}</div>
          <div className="mb-2"><strong>Remote Address:</strong> {profile['remote-address']}</div>
          <div className="mb-2"><strong>Use Compression:</strong> {profile['use-compression']}</div>
          <div className="mb-2"><strong>Use Encryption:</strong> {profile['use-encryption']}</div>
          <div className="mb-2"><strong>Use IPv6:</strong> {profile['use-ipv6']}</div>
          <div className="mb-2"><strong>Use MPLS:</strong> {profile['use-mpls']}</div>
          <div className="mb-2"><strong>Use UPNP:</strong> {profile['use-upnp']}</div>
        </div>
      )}
    </Modal>
  );
};

export default PPPProfileModal;
