import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { Text, Card, Layout, Button } from "@ui-kitten/components";
import { SharedElement } from "react-navigation-shared-element";

import PriceIcon from "../../icons/PriceIcon";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import PopUpMsg from "../reusable/PopUpMsg";
import EditFoodDetailsForm from "./EditFoodDetailsForm";
import RoAPI from "../../api/restaurant-owner-caller";

function FoodDetails({ route, navigation }) {
  //header and footer for card
  const Header = (props, data) => (
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
      <Button size="tiny" status="danger">
        <DeleteIcon style={{ width: 23, height: 23 }} />
      </Button>
    </Layout>
  );

  const { data } = route.params;

  //input data update for edit form
  const [foodPrice, setFoodPrice] = useState(data.foodPrice);
  const [foodDesc, setFoodDesc] = useState(data.foodDesc);
  const [foodCalories, setFoodCalories] = useState(
    data.foodNutritionalFacts.foodCalories
  );
  const [foodProtein, setFoodProtein] = useState(
    data.foodNutritionalFacts.foodProtein
  );
  const [foodCarbohydrates, setFoodCarbohydrates] = useState(
    data.foodNutritionalFacts.foodCarbohydrates
  );
  const [foodFat, setFoodFat] = useState(data.foodNutritionalFacts.foodFat);
  const [foodIngredients, setFoodIngredients] = useState(data.foodIngredients);

  //prompt edit form
  const [promptEditForm, setPromptEditForm] = useState(false);

  //pop up msg props
  const [promptPopUpMsg, setPromptPopUpMsg] = useState(false);
  const [editSuccess, setEditSuccess] = useState(null);
  const [popUpMsg, setPopUpMsg] = useState("");

  //loading signal
  const [isLoading, setIsLoading] = useState(false);

  //edit function
  const handleEditFoodDetails = () => {
    //setIsLoading(true);
    // let editedFoodData = {
    //   _id: data._id,
    //   foodPrice: parseFloat(foodPrice),
    //   foodDesc: foodDesc,
    //   foodNutritionalFacts: {
    //     foodCalories: parseInt(foodCalories),
    //     foodProtein: parseInt(foodProtein),
    //     foodCarbohydrates: parseInt(foodCarbohydrates),
    //     foodFat: parseInt(foodFat),
    //   },
    //   foodIngredients: foodIngredients,
    // };
    // const response = await RoAPI.editFoodDetails(editedFoodData);
    // if (response.success) {
    //   setPromptEditForm(false);
    //   setPopUpMsg(response.msg);
    //   setEditSuccess(true);
    //   setPromptPopUpMsg(true);
    // } else {
    //   console.log("error when editing food details: " + response.error);
    // }
    //setIsLoading(false);
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
              header={(props) => Header(props, data)}
              footer={Footer}
            >
              <Layout style={styles.textDetailsContainer}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                  Description:{" "}
                </Text>
                <Text style={{ fontSize: 17 }}>{data.foodDesc}</Text>
              </Layout>
              <Layout style={{ marginTop: 10, ...styles.textDetailsContainer }}>
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

      <EditFoodDetailsForm
        visible={promptEditForm}
        onPressEdit={handleEditFoodDetails}
        onPressCancel={() => setPromptEditForm(false)}
        foodData={data}
        onChangePrice={setFoodPrice}
        onChangeDesc={setFoodDesc}
        onChangeIngredients={setFoodIngredients}
        onChangeCalories={setFoodCalories}
        onChangeProtein={setFoodProtein}
        onChangeCarbohydrates={setFoodCarbohydrates}
        onChangeFat={setFoodFat}
        isLoading={isLoading}
      />

      <PopUpMsg
        visible={false}
        onPress={() => setPromptPopUpMsg(false)}
        success={editSuccess}
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
});

export default FoodDetails;
