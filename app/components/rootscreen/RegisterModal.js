import React, { useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { SimpleAnimation } from "react-native-simple-animations";
import {
  Layout,
  Text,
  Divider,
  Input,
  Button,
  Spinner,
} from "@ui-kitten/components";

import colors from "../../config/colors";
import RoAPI from "../../api/restaurant-owner-caller";
import { inputRegexValidation } from "../../utilities/inputRegexes";
import PopUpMsg from "../reusable/PopUpMsg";

function RegisterModal({ onPromptRegisterModal }) {
  //input data update
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);

  //submission success signal
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //input error signal
  const [inputError, setInputError] = useState({
    errorField: null,
    errorMsg: null,
  });

  //loading signal
  const [isLoading, setIsLoading] = useState(false);

  const validateFormData = () => {
    var validate = false;

    if (username.trim() === "") {
      setInputError({
        errorField: "username",
        errorMsg: "username cannot be emtpy.",
      });
    } else if (password.trim() === "") {
      setInputError({
        errorField: "password",
        errorMsg: "password cannot be empty.",
      });
    } else if (lastName.trim() === "") {
      setInputError({
        errorField: "lastName",
        errorMsg: "last name cannot be empty.",
      });
    } else if (email.trim() === "") {
      setInputError({
        errorField: "email",
        errorMsg: "email cannot be empty.",
      });
    } else if (restaurantName.trim() === "") {
      setInputError({
        errorField: "restaurantName",
        errorMsg: "business name cannot be empty.",
      });
    } else if (restaurantAddress.trim() === "") {
      setInputError({
        errorField: "restaurantAddress",
        errorMsg: "restaurant address cannot be empty.",
      });
    } else if (contactNo.trim() === "") {
      setInputError({
        errorField: "contactNo",
        errorMsg: "contact no. cannot be empty.",
      });
    } else if (!inputRegexValidation.usernameRegex.test(username)) {
      setInputError({
        errorField: "username",
        errorMsg:
          "username must has at least 5 characters and cannot contain special characters or space.",
      });
    } else if (!inputRegexValidation.passwordRegex.test(password)) {
      setInputError({
        errorField: "password",
        errorMsg:
          "password must has a minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
      });
    } else if (!inputRegexValidation.firstNameRegex.test(firstName)) {
      setInputError({
        errorField: "firstName",
        errorMsg: "first name cannot cotains special characters.",
      });
    } else if (!inputRegexValidation.lastNameRegex.test(lastName)) {
      setInputError({
        errorField: "lastName",
        errorMsg: "last name cannot cotains special characters.",
      });
    } else if (!inputRegexValidation.emailRegex.test(email)) {
      setInputError({ errorField: "email", errorMsg: "Invalid email format." });
    } else if (restaurantAddress.length < 10) {
      setInputError({
        errorField: "restaurantAddress",
        errorMsg: "restaurant address must has at least 10 characters.",
      });
    } else if (!inputRegexValidation.contactNoRegex.test(contactNo)) {
      setInputError({
        errorField: "contactNo",
        errorMsg: "Invalid contact no.",
      });
    } else {
      setInputError({ errorField: null, errorMsg: null });
      validate = true;
    }
    return validate;
  };

  const handleSubmitRegistration = async () => {
    setIsLoading(true);

    const validateInput = validateFormData();

    if (validateInput) {
      let data = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        restaurant: {
          restaurantName: restaurantName,
          restaurantAddress: restaurantAddress,
          logoFilePath: selectedLogo,
        },
        contactNo: contactNo,
      };

      const response = await RoAPI.registerRO(data);
      if (response.success) {
        console.log("submitted!");
        setSubmitSuccess(true);
      } else {
        if (response.error.keyValue.username === username) {
          setInputError({
            errorField: "username",
            errorMsg: "username already exists.",
          });
          setSubmitSuccess(false);
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <SimpleAnimation
      direction="up"
      movementType="slide"
      duration={2000}
      distance={400}
    >
      <Layout level="2" style={styles.registerForm}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <Text category="h5">PARTNER WITH US</Text>
          <Divider style={styles.divider} />
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setUsername(text)}
              status={inputError.errorField === "username" && "danger"}
              textStyle={styles.formInput}
              placeholder="Username"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setPassword(text)}
              status={inputError.errorField === "password" && "danger"}
              textStyle={styles.formInput}
              placeholder="Password"
              secureTextEntry={true}
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "firstName" && "danger"}
              onChangeText={(text) => setFirstName(text)}
              textStyle={styles.formInput}
              placeholder="First name (optional)"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "lastName" && "danger"}
              onChangeText={(text) => setLastName(text)}
              textStyle={styles.formInput}
              placeholder="Last name"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "email" && "danger"}
              onChangeText={(text) => setEmail(text)}
              textStyle={styles.formInput}
              placeholder="E-mail"
            ></Input>
          </Layout>

          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "restaurantName" && "danger"}
              onChangeText={(text) => setRestaurantName(text)}
              textStyle={styles.formInput}
              placeholder="Business name"
            ></Input>
          </Layout>

          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "restaurantAddress" && "danger"}
              multiline={true}
              onChangeText={(text) => setRestaurantAddress(text)}
              textStyle={styles.formMultiLineInput}
              placeholder="Business Address"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "contactNo" && "danger"}
              onChangeText={(text) => setContactNo(text)}
              textStyle={styles.formInput}
              placeholder="Contact No."
              size="large"
            ></Input>
          </Layout>

          {inputError.errorField && (
            <Text style={styles.errorMsg}>{inputError.errorMsg}</Text>
          )}

          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status="success"
              onPress={handleSubmitRegistration}
            >
              {isLoading ? <Spinner status="control" /> : "SUBMIT"}
            </Button>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status="danger"
              onPress={onPromptRegisterModal}
            >
              CANCEL
            </Button>
          </Layout>
        </ScrollView>
      </Layout>

      <PopUpMsg
        visible={submitSuccess}
        success={submitSuccess}
        text={"Submitted, Waiting for Approval!"}
        onPress={() => setSubmitSuccess(false)}
      />
    </SimpleAnimation>
  );
}

const styles = StyleSheet.create({
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
    width: "95%",
    height: Dimensions.get("screen").height - 100,
    padding: 25,
    paddingRight: 0,
    paddingLeft: 0,
    alignSelf: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
});

export default RegisterModal;
