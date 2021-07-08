import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Layout,
  Button,
  Divider,
  Input,
  Spinner,
  Modal,
  Icon,
} from "@ui-kitten/components";
import { SharedElement } from "react-navigation-shared-element";
import { StackActions } from "@react-navigation/routers";
import * as firebase from "firebase";

import PriceIcon from "../../icons/PriceIcon";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import PopUpMsg from "../reusable/PopUpMsg";
import colors from "../../config/colors";
import { inputRegexValidation } from "../../utilities/inputRegexes";
import RoAPI from "../../api/restaurant-owner-caller";
import CustomerAPI from "../../api/customer-caller";

function FoodDetails({ route, navigation }) {
  //restaurant owner data
  const { data } = route.params;

  //header and footer for card
  const Header = (props) => (
    <Layout {...props}>
      <Text category="h2" style={{ fontWeight: "bold" }}>
        {data.foodName}
      </Text>
      <Layout style={styles.priceContainer}>
        <Text category="h5">RM {data.foodPrice}</Text>
        <PriceIcon
          alignSelf="flex-start"
          style={{ width: 27, height: 27, marginLeft: 5, marginTop: 2 }}
        />
      </Layout>
    </Layout>
  );

  const Footer = (props) => (
    <Layout {...props} style={[props.style, styles.footerContainer]}>
      <Button
        size="tiny"
        status="warning"
        onPress={() => setPromptEditForm(true)}
      >
        <EditIcon style={{ width: 23, height: 23 }} />
      </Button>
      <Button
        size="tiny"
        status="danger"
        onPress={() =>
          handleSetUpConfirmDialog("Are you sure you want to delete?")
        }
      >
        {isLoading ? (
          <Spinner status="control" />
        ) : (
          <DeleteIcon style={{ width: 23, height: 23 }} />
        )}
      </Button>
    </Layout>
  );

  //Icon for counter
  const AddCountIcon = (props) => (
    <Icon
      name="plussquare"
      {...props}
      style={[props.style, { height: 35, width: 35, color: colors.primary }]}
    />
  );

  const MinusCountIcon = (props) => (
    <Icon
      name="minussquare"
      {...props}
      style={[props.style, { height: 35, width: 35, color: colors.error }]}
    />
  );

  //counter for customer
  //minimum count of 1
  const [count, setCount] = useState(1);

  const addCountHandler = () => {
    setCount(count + 1);
  };
  const minusCountHandler = () => {
    if (count === 1) {
      return;
    }
    setCount(count - 1);
  };

  const [orderItem, setOrderItem] = useState({
    foodId: null,
    foodName: null,
    foodTotalPrice: 0,
    foodCount: 0,
  });

  const handleAddToOrder = async () => {
    setIsLoading(true);

    const orderId = data.orderData._id;

    //check if it is the same food to add to the order
    if (orderItem.foodId === data._id) {
      setOrderItem({
        foodId: data._id,
        foodName: data.foodName,
        foodTotalPrice: orderItem.foodTotalPrice + count * data.foodPrice,
        foodCount: orderItem.foodCount + count,
      });

      console.log("we are here: " + JSON.stringify(orderItem));
    } else {
      //else create a new item and add to the order

      console.log("data: " + JSON.stringify(data));

      //seems like it will not immediately update after setorder item...

      setOrderItem({
        foodId: data._id,
        foodName: data.foodName,
        foodTotalPrice: data.foodPrice * count,
        foodCount: count,
      });
      console.log(
        "updated order item inside new order update: " +
          JSON.stringify(orderItem)
      );
    }

    //after that, update the order in the database
    const orderTotalPrice =
      data.orderData.orderTotalPrice + orderItem.foodTotalPrice;

    console.log("order total price: " + orderTotalPrice);
    console.log("order data total price: " + JSON.stringify(data.orderData));
    console.log("new order total price: " + orderItem.foodTotalPrice);
    console.log("updated order item: " + JSON.stringify(orderItem));

    const orderInfo = {
      _id: orderId,
      orderTotalPrice: orderTotalPrice,
      orderItem: orderItem,
    };

    //checkpoint here
    console.log("order Info: " + JSON.stringify(orderInfo));

    const response = await CustomerAPI.updateOrder(orderInfo);

    if (response.success) {
      //maybe trigger the pop up message
      console.log(JSON.stringify(response));
    } else {
      console.log(response.msg + ": " + response.error);
    }

    setIsLoading(false);
  };

  const CustomerFooter = (props) => (
    //counter and order button
    <Layout
      {...props}
      style={[
        props.style,
        { flexDirection: "row", justifyContent: "flex-start" },
      ]}
    >
      <TouchableOpacity onPress={minusCountHandler}>
        <MinusCountIcon />
      </TouchableOpacity>
      <Text
        style={{ marginLeft: 20, marginRight: 20, marginTop: 5, fontSize: 18 }}
      >
        {count}
      </Text>
      <TouchableOpacity onPress={addCountHandler}>
        <AddCountIcon />
      </TouchableOpacity>
      <Button
        size="small"
        status="success"
        onPress={handleAddToOrder}
        style={{ flex: 1, marginLeft: 50 }}
      >
        {isLoading ? <Spinner status="control" /> : "ADD TO ORDER"}
      </Button>
    </Layout>
  );

  //input data update for edit form
  const [foodPrice, setFoodPrice] = useState(data.foodPrice.toString());
  const [foodDesc, setFoodDesc] = useState(data.foodDesc);
  const [foodCalories, setFoodCalories] = useState(
    data.foodNutritionalFacts.foodCalories.toString()
  );
  const [foodProtein, setFoodProtein] = useState(
    data.foodNutritionalFacts.foodProtein.toString()
  );
  const [foodCarbohydrates, setFoodCarbohydrates] = useState(
    data.foodNutritionalFacts.foodCarbohydrates.toString()
  );
  const [foodFat, setFoodFat] = useState(
    data.foodNutritionalFacts.foodFat.toString()
  );
  const [foodIngredients, setFoodIngredients] = useState(data.foodIngredients);

  //prompt edit form
  const [promptEditForm, setPromptEditForm] = useState(false);

  //pop up msg props
  const [promptPopUpMsg, setPromptPopUpMsg] = useState(false);
  const [editSuccess, setEditSuccess] = useState(null);
  const [popUpMsg, setPopUpMsg] = useState("");

  //pop up msg - confirm msg props
  const [promptConfirmMsg, setPromptConfirmMsg] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState("");

  const handleSetUpConfirmDialog = (msg) => {
    setPromptConfirmMsg(true);
    setConfirmMsg(msg);
  };

  const handleClosePopUpModal = () => {
    setPromptPopUpMsg(false);
    navigation.dispatch(StackActions.pop(1));
  };

  const handleCancelEditForm = () => {
    setPromptEditForm(false);
    navigation.dispatch(StackActions.pop(1));
  };

  //loading signal
  const [isLoading, setIsLoading] = useState(false);

  //error fields signal
  const [inputError, setInputError] = useState({
    errorField: null,
    errorMsg: null,
  });

  const validateFormData = () => {
    var validate = false;

    if (foodPrice.trim() === "") {
      setInputError({
        errorField: "foodPrice",
        errorMsg: "food price cannot be empty.",
      });
    } else if (foodCalories.trim() === "") {
      setInputError({
        errorField: "foodCalories",
        errorMsg: "food calories cannot be empty.",
      });
    } else if (foodProtein.trim() === "") {
      setInputError({
        errorField: "foodProtein",
        errorMsg: "food protein cannot be empty.",
      });
    } else if (foodFat.trim() === "") {
      setInputError({
        errorField: "foodFat",
        errorMsg: "food fat cannot be empty.",
      });
    } else if (foodDesc.trim() === "") {
      setInputError({
        errorField: "foodDesc",
        errorMsg: "food description cannot be empty.",
      });
    } else if (!inputRegexValidation.numberOnlyRegex.test(foodPrice)) {
      setInputError({
        errorField: "foodPrice",
        errorMsg: "food price should only contains numbers or decimals.",
      });
    } else if (!inputRegexValidation.numberOnlyRegex.test(foodCalories)) {
      setInputError({
        errorField: "foodCalories",
        errorMsg: "food calories should only contains numbers or decimals.",
      });
    } else if (!inputRegexValidation.numberOnlyRegex.test(foodProtein)) {
      setInputError({
        errorField: "foodProtein",
        errorMsg: "food protein should only contains numbers or decimals.",
      });
    } else if (!inputRegexValidation.numberOnlyRegex.test(foodCarbohydrates)) {
      setInputError({
        errorField: "foodCarbohydrates",
        errorMsg:
          "food carbohydrates should only contains numbers or decimals.",
      });
    } else if (!inputRegexValidation.numberOnlyRegex.test(foodFat)) {
      setInputError({
        errorField: "foodFat",
        errorMsg: "food fat should only contains numbers or decimals.",
      });
    } else {
      setInputError({ errorField: null, errorMsg: null });
      validate = true;
    }
    return validate;
  };

  //edit function
  const handleEditFoodDetails = async () => {
    setIsLoading(true);

    const validateInput = validateFormData();

    if (validateInput) {
      let editedFoodData = {
        _id: data._id,
        foodPrice: parseFloat(foodPrice),
        foodDesc: foodDesc,
        foodNutritionalFacts: {
          foodCalories: parseInt(foodCalories),
          foodProtein: parseInt(foodProtein),
          foodCarbohydrates: parseInt(foodCarbohydrates),
          foodFat: parseInt(foodFat),
        },
        foodIngredients: foodIngredients,
      };
      const response = await RoAPI.editFoodDetails(editedFoodData);
      if (response.success) {
        setPromptEditForm(false);
        setPopUpMsg(response.msg);
        setEditSuccess(true);
        setPromptPopUpMsg(true);
      } else {
        console.log("error when editing food details: " + response.error);
      }
    }
    setIsLoading(false);
  };

  const deleteAsset = async (filePath) => {
    let ref = firebase.default.storage().ref().child(filePath);
    ref.delete();
  };

  const handleDeleteFood = async () => {
    setIsLoading(true);

    setPromptConfirmMsg(false);

    const roAndFoodInfo = {
      restaurantOwnerId: data.restaurantOwnerId,
      foodId: data._id,
    };

    const response = await RoAPI.deleteFoodFromMenu(roAndFoodInfo);

    if (response.success) {
      //delete food blob data in firebase
      await deleteAsset(data.foodModelAssets.foodObjFilePath);
      await deleteAsset(data.foodModelAssets.foodMtlFilePath);
      await deleteAsset(data.foodModelAssets.foodTextureFilePath);
      await deleteAsset(data.foodThumbnailFilePath);

      setPopUpMsg(response.msg);
      setDeleteSuccess(true);
      setPromptPopUpMsg(true);
    } else {
      setPopUpMsg(response.msg);
      setDeleteSuccess(false);
      setPromptPopUpMsg(true);
      console.log("error: " + response.error);
    }
  };

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <React.Fragment>
      {promptEditForm ? (
        <Layout level="2" style={styles.registerForm}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Text category="h5">EDIT DETAILS</Text>
            <Divider style={styles.divider} />
            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Price:
              </Text>
              <Input
                onChangeText={(text) => setFoodPrice(text)}
                status={inputError.errorField === "foodPrice" && "danger"}
                textStyle={styles.formInput}
                placeholder="Food Price (RM) e.g. 23"
                defaultValue={data.foodPrice.toString()}
              ></Input>
            </Layout>
            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Description:
              </Text>
              <Input
                onChangeText={(text) => setFoodDesc(text)}
                status={inputError.errorField === "foodDesc" && "danger"}
                textStyle={styles.formInput}
                placeholder="Food Description"
                defaultValue={data.foodDesc}
              ></Input>
            </Layout>
            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Calories:
              </Text>
              <Input
                status={inputError.errorField === "foodCalories" && "danger"}
                onChangeText={(text) => setFoodCalories(text)}
                textStyle={styles.formInput}
                placeholder="Food Calories (kcal) e.g. 234"
                defaultValue={data.foodNutritionalFacts.foodCalories.toString()}
              ></Input>
            </Layout>
            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Protein:
              </Text>
              <Input
                status={inputError.errorField === "foodProtein" && "danger"}
                onChangeText={(text) => setFoodProtein(text)}
                textStyle={styles.formInput}
                placeholder="Food Protein (g) e.g. 24"
                defaultValue={data.foodNutritionalFacts.foodProtein.toString()}
              ></Input>
            </Layout>
            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Carbohydrates:
              </Text>
              <Input
                status={
                  inputError.errorField === "foodCarbohydrates" && "danger"
                }
                onChangeText={(text) => setFoodCarbohydrates(text)}
                textStyle={styles.formInput}
                placeholder="Food Carbohydrates (g) e.g. 45"
                defaultValue={data.foodNutritionalFacts.foodCarbohydrates.toString()}
              ></Input>
            </Layout>

            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Fat:
              </Text>
              <Input
                status={inputError.errorField === "foodFat" && "danger"}
                onChangeText={(text) => setFoodFat(text)}
                textStyle={styles.formInput}
                placeholder="Food Fat (g) e.g. 16"
                defaultValue={data.foodNutritionalFacts.foodFat.toString()}
              ></Input>
            </Layout>

            <Layout style={styles.formInputContainer}>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Ingredients:
              </Text>
              <Input
                multiline={true}
                onChangeText={(text) => setFoodIngredients(text)}
                textStyle={styles.formMultiLineInput}
                placeholder="Food Ingredients e.g. rice, salt, pepper..."
                defaultValue={data.foodIngredients}
              ></Input>
            </Layout>

            {inputError.errorField && (
              <Text style={styles.errorMsg}>{inputError.errorMsg}</Text>
            )}

            <Layout style={styles.formInputContainer}>
              <Button
                size="large"
                status="success"
                onPress={handleEditFoodDetails}
              >
                {isLoading ? <Spinner status="control" /> : "EDIT"}
              </Button>
            </Layout>
            <Layout style={{ marginBottom: 15, ...styles.formInputContainer }}>
              <Button
                size="large"
                status="danger"
                onPress={handleCancelEditForm}
              >
                CANCEL
              </Button>
            </Layout>
          </ScrollView>
        </Layout>
      ) : (
        <Animated.View
          style={{ opacity, flex: 1, paddingTop: StatusBar.currentHeight }}
        >
          <SharedElement id={data._id}>
            <Image
              style={{ width: Dimensions.get("screen").width, height: 250 }}
              source={{ uri: data.thumbnailUrl }}
            />
          </SharedElement>
          <Layout level="2" style={styles.detailsContainer}>
            <ScrollView>
              <Card
                style={styles.card}
                header={(props) => Header(props)}
                footer={
                  data.role === "customer"
                    ? (props) => CustomerFooter(props)
                    : (props) => Footer(props)
                }
              >
                <Layout style={styles.textDetailsContainer}>
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                    Description:{" "}
                  </Text>
                  <Text style={{ fontSize: 17 }}>{data.foodDesc}</Text>
                </Layout>
                <Layout
                  style={{ marginTop: 10, ...styles.textDetailsContainer }}
                >
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                    Ingredients:{" "}
                  </Text>
                  <Text style={{ fontSize: 17 }}>
                    {data.foodIngredients ? data.foodIngredients : "N/A"}
                  </Text>
                </Layout>
              </Card>
            </ScrollView>
          </Layout>
        </Animated.View>
      )}

      <PopUpMsg
        promptConfirmMsg={promptConfirmMsg}
        confirmMsg={confirmMsg}
        onPressCancelConfirm={() => setPromptConfirmMsg(false)}
        onPressConfirm={handleDeleteFood}
        visible={promptPopUpMsg}
        onPress={handleClosePopUpModal}
        success={editSuccess || deleteSuccess}
        text={popUpMsg}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
  },
  card: {
    margin: 15,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  textDetailsContainer: {
    flexDirection: "row",
  },
  centerText: {
    textAlign: "center",
  },
  divider: {
    height: 3,
    marginTop: 15,
    width: "80%",
  },
  errorMsg: {
    alignSelf: "flex-start",
    paddingRight: 25,
    color: colors.error,
    fontSize: 15,
    marginTop: 10,
    width: 320,
  },
  formInput: {
    fontSize: 19,
    height: 40,
  },
  formMultiLineInput: {
    fontSize: 19,
    minHeight: 70,
  },
  formInputContainer: {
    width: 320,
    marginTop: 20,
    marginRight: 15,
  },
  registerForm: {
    borderRadius: 25,
    height: Dimensions.get("screen").height - 100,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
});

export default FoodDetails;
