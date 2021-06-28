import axios from "axios";
import { HOST_URL } from "../server/master-data-base-url";

const registerRO = async (roInfo) => {
  return await axios
    .post(HOST_URL + "/api/restaurant-owner/register-restaurant-owner", roInfo)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export default {
  registerRO,
};
