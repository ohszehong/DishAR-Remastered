import axios from "axios";
import { HOST_URL } from "../../server/master-data-base-url";

const login = async (credentials) => {
  if (credentials.username.substring(0, 5) === "admin") {
    return await axios
      .post(HOST_URL + "/api/admin/login-as-admin", credentials)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => {
        return err.response.data;
      });
  } else {
    return await axios
      .post(
        HOST_URL + "/api/restaurant-owner/login-as-restaurant-owner",
        credentials
      )
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => {
        return err.response.data;
      });
  }
};

export default {
  login,
};
