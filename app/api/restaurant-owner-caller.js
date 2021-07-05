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
      return err.response.data;
    });
};

const getPendingRO = async () => {
  return await axios
    .get(HOST_URL + "/api/restaurant-owner/get-pending-restaurant-owners")
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

const addFoodToMenu = async (foodInfo) => {
  return await axios
    .post(HOST_URL + "/api/restaurant-owner/add-food-to-menu", foodInfo)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

const editFoodDetails = async (foodInfo) => {
  return await axios
    .post(HOST_URL + "/api/restaurant-owner/edit-food-details", foodInfo)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export default {
  registerRO,
  getPendingRO,
  addFoodToMenu,
  editFoodDetails,
};
