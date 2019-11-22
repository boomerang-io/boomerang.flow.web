import React from "react";
import PropTypes from "prop-types";

const Upload = ({ className, ...rest }) => {
  return (
    <svg
      className={className}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ willChange: "transform" }}
      {...rest}
    >
      <path d="M11 18l1.41 1.41L15 16.83V29h2V16.83l2.59 2.58L21 18l-5-5-5 5z" />
      <path d="M23.5 22H23v-2h.5a4.5 4.5 0 0 0 .36-9H23l-.1-.82a7 7 0 0 0-13.88 0L9 11h-.86a4.5 4.5 0 0 0 .36 9H9v2h-.5A6.5 6.5 0 0 1 7.2 9.14a9 9 0 0 1 17.6 0A6.5 6.5 0 0 1 23.5 22z" />
    </svg>
  );
};

Upload.propTypes = {
  className: PropTypes.string
};

export default Upload;
