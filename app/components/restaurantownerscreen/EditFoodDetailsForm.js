import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import {
  Modal,
  Text,
  Button,
  Layout,
  Divider,
  Input,
  Spinner,
} from "@ui-kitten/components";

import colors from "../../config/colors";

function EditFoodDetailsForm({
  visible,
  onPressEdit,
  onPressCancel,
  foodData,
  onChangePrice,
  onChangeDesc,
  onChangeIngredients,
  onChangeCalories,
  onChangeProtein,
  onChangeCarbohydrates,
  onChangeFat,
  isLoading,
}) {
  const EditFoodDetailsModal = () => {
    try {
      return (
        <Modal
          visible={visible}
          backdropStyle={{ backgroundColor: colors.backdrop }}
        >
          <Layout level="2" style={styles.registerForm}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <Text category="h5">EDIT DETAILS</Text>
              <Divider style={styles.divider} />
              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Price:
                </Text>
                <Input
                  onChangeText={(text) => onChangePrice(text)}
                  //   status={inputError.errorField === "username" && "danger"}
                  textStyle={styles.formInput}
                  placeholder="Food Price (RM) e.g. 23"
                  defaultValue={foodData.foodPrice.toString()}
                ></Input>
              </Layout>
              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Description:
                </Text>
                <Input
                  onChangeText={(text) => onChangeDesc(text)}
                  //   status={inputError.errorField === "password" && "danger"}
                  textStyle={styles.formInput}
                  placeholder="Food Description"
                  defaultValue={foodData.foodDesc}
                ></Input>
              </Layout>
              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Calories:
                </Text>
                <Input
                  //   status={inputError.errorField === "firstName" && "danger"}
                  onChangeText={(text) => onChangeCalories(text)}
                  textStyle={styles.formInput}
                  placeholder="Food Calories (kcal) e.g. 234"
                  defaultValue={foodData.foodNutritionalFacts.foodCalories.toString()}
                ></Input>
              </Layout>
              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Protein:
                </Text>
                <Input
                  //   status={inputError.errorField === "lastName" && "danger"}
                  onChangeText={(text) => onChangeProtein(text)}
                  textStyle={styles.formInput}
                  placeholder="Food Protein (g) e.g. 24"
                  defaultValue={foodData.foodNutritionalFacts.foodProtein.toString()}
                ></Input>
              </Layout>
              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Carbohydrates:
                </Text>
                <Input
                  //   status={inputError.errorField === "email" && "danger"}
                  onChangeText={(text) => onChangeCarbohydrates(text)}
                  textStyle={styles.formInput}
                  placeholder="Food Carbohydrates (g) e.g. 45"
                  defaultValue={foodData.foodNutritionalFacts.foodCarbohydrates.toString()}
                ></Input>
              </Layout>

              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Fat:
                </Text>
                <Input
                  //   status={inputError.errorField === "restaurantName" && "danger"}
                  onChangeText={(text) => onChangeFat(text)}
                  textStyle={styles.formInput}
                  placeholder="Food Fat (g) e.g. 16"
                  defaultValue={foodData.foodNutritionalFacts.foodFat.toString()}
                ></Input>
              </Layout>

              <Layout style={styles.formInputContainer}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Ingredients:
                </Text>
                <Input
                  //   status={inputError.errorField === "restaurantAddress" && "danger"}
                  multiline={true}
                  onChangeText={(text) => onChangeIngredients(text)}
                  textStyle={styles.formMultiLineInput}
                  placeholder="Food Ingredients e.g. rice, salt, pepper..."
                  defaultValue={foodData.foodIngredients}
                ></Input>
              </Layout>

              {/* {inputError.errorField && (
            <Text style={styles.errorMsg}>{inputError.errorMsg}</Text>
          )} */}

              <Layout style={styles.formInputContainer}>
                <Button size="large" status="success" onPress={onPressEdit}>
                  {isLoading ? <Spinner status="control" /> : "EDIT"}
                </Button>
              </Layout>
              <Layout style={styles.formInputContainer}>
                <Button size="large" status="danger" onPress={onPressCancel}>
                  CANCEL
                </Button>
              </Layout>
            </ScrollView>
          </Layout>

          {/* <PopUpMsg
        visible={submitSuccess}
        success={submitSuccess}
        text={"Submitted, Waiting for Approval!"}
        onPress={() => setSubmitSuccess(false)}
      /> */}
        </Modal>
      );
    } catch (err) {
      console.log("error" + err);
      return null;
    }
  };

  return <EditFoodDetailsModal />;
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    minHeight: 200,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
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
    paddingLeft: 25,
    paddingRight: 25,
    color: colors.error,
    fontSize: 15,
    marginTop: 10,
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
    width: "90%",
    marginTop: 20,
  },
  registerForm: {
    borderRadius: 25,
    height: Dimensions.get("screen").height - 100,
    padding: 25,
    paddingRight: 0,
    paddingLeft: 0,
    alignItems: "center",
  },
});

export default EditFoodDetailsForm;
