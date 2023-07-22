import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import  AlertTemplate  from "react-alert-template-basic";


const options = {
  timeout: 5000,
  position: positions.TOP,
  transition: transitions.SCALE,
  offset: "20px",
  theme: {
    primary: "green",
    secondary: "blue",
  },
};

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById("root")
);
