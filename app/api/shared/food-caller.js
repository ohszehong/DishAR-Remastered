import axios from "axios";
import { HOST_URL } from "../../server/master-data-base-url";

const retrieveFood = async (foodId) => {
  return await axios
    .post(HOST_URL + "/api/food/get-food", foodId)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export default {
  retrieveFood,
};
