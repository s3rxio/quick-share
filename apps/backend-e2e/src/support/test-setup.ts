/* eslint-disable */

import axios from "axios";

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.API_HOST || "localhost";
  const port = process.env.API_PORT || "3000";

  axios.defaults.baseURL = `http://${host}:${port}`;
};
