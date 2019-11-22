import React from "react";
import { render } from "react-dom";
import configureStore from "./store/configureStore";
import Root from "./Root";
import "Config/axiosGlobalConfig";
import "typeface-ibm-plex-sans";
import "Styles/styles.scss";

const store = configureStore();

// Setup hot module reloading to improve dev experience
render(<Root store={store} />, document.getElementById("app"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
