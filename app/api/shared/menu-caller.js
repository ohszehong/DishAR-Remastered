import axios from "axios";
import { HOST_URL } from "../../server/master-data-base-url";

const retrieveMenu = async (roId) => {
  return await axios
    .post(HOST_URL + "/api/menu/get-menu", roId)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export default {
  retrieveMenu,
};
