import axios from "axios";
import { HOST_URL } from "../server/master-data-base-url";

//the restaurantId is the restaurant owner id.
const createOrder = async (restaurantId) => {
  return await axios
    .post(HOST_URL + "/api/customer/create-order", restaurantId)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

const updateOrder = async (orderInfo) => {
  return await axios
    .post(HOST_URL + "/api/customer/update-order", orderInfo)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export default {
  createOrder,
  updateOrder,
};
