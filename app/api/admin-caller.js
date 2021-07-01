import axios from "axios";
import { HOST_URL } from "../server/master-data-base-url";

const approveRO = async (roId) => {
  return await axios
    .post(HOST_URL + "/api/admin/approve-restaurant-owner", roId)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

const rejectRO = async (roId) => {
  return await axios
    .post(HOST_URL + "/api/admin/reject-restaurant-owner", roId)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export default {
  approveRO,
  rejectRO,
};
