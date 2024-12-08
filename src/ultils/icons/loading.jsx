import "./loading.scss";
export const LoadingIcon = ({ fill }) => (
  <div className="loading-container">
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 50 50"
      xmlSpace="preserve"
      width="24px"
      height="24px"
      className="loading-icon"
    >
      <circle
        fill="none"
        stroke="#0866ff"
        strokeWidth="5"
        cx="25"
        cy="25"
        r="20"
        strokeDasharray="90, 150"
        transform="rotate(129.137 25 25)"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);
