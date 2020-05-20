import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChevronLeft32 } from "@carbon/icons-react";
import styles from "./navigateBack.module.scss";

const NavigateBack = ({ className, onClick, style, text, to }) => (
  <button className={className} style={style} onClick={onClick}>
    <Link className={styles.container} to={to}>
      <ChevronLeft32 className={styles.chevron} />
      <span className={styles.text}>{text}</span>
    </Link>
  </button>
);

NavigateBack.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default NavigateBack;
