// src/components/QRCodePopup.jsx
import React from 'react';
import QRCode from 'qrcode.react';
import './qr_code.scss';

const QRCodePopup = ({ show, url, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="qr-code-popup-overlay" onClick={onClose}>
      <div className="qr-code-popup" onClick={(e) => e.stopPropagation()}>
        <QRCode value={url} size={256} />
      </div>
    </div>
  );
};

export default QRCodePopup;
