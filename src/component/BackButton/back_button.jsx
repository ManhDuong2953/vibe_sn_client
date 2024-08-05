import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import './back_button.scss';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <FaAngleLeft />
    </button>
  );
};

export default BackButton;
