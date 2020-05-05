import React from "react";
import PropTypes from "prop-types";

const Brush1 = ({ className, ...rest }) => {
  return (
    <svg className={className} focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" style={{willChange: "transform"}}{...rest}><path d="M28.8281,3.1719a4.0941,4.0941,0,0,0-5.6562,0L4.05,22.292A6.9537,6.9537,0,0,0,2,27.2412V30H4.7559a6.9523,6.9523,0,0,0,4.95-2.05L28.8281,8.8286a3.999,3.999,0,0,0,0-5.6567ZM10.91,18.26l2.8286,2.8286L11.6172,23.21,8.7886,20.3818ZM8.2915,26.5356A4.9665,4.9665,0,0,1,4.7559,28H4v-.7588a4.9671,4.9671,0,0,1,1.4644-3.5351l1.91-1.91,2.8286,2.8281ZM27.4141,7.4141,15.1528,19.6748l-2.8286-2.8286,12.2617-12.26a2.0473,2.0473,0,0,1,2.8282,0,1.9995,1.9995,0,0,1,0,2.8282Z"></path><title>Paint brush alt</title></svg>
  );
};

Brush1.propTypes = {
  className: PropTypes.string
};

export default Brush1;
