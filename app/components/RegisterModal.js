import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { SimpleAnimation } from "react-native-simple-animations";
import {
  Modal,
  Layout,
  Text,
  Divider,
  Input,
  Button,
} from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";
import RoAPI from "../api/restaurant-owner-caller";

function RegisterModal({ onPromptRegisterModal }) {
  const [selectedLogo, setSelectedLogo] = useState(null);

  //input data update
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");

  const handleChooseLogo = async () => {
    const options = {
      mediaType: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);

    console.log(result);

    if (!result.cancelled) {
      setSelectedLogo(result.uri);
    }
  };

  const handleSubmitRegistration = async () => {
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
    }
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
              textStyle={styles.formInput}
              placeholder="Username"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setPassword(text)}
              textStyle={styles.formInput}
              placeholder="Password"
              secureTextEntry={true}
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setFirstName(text)}
              textStyle={styles.formInput}
              placeholder="First name"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setLastName(text)}
              textStyle={styles.formInput}
              placeholder="Last name"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setEmail(text)}
              textStyle={styles.formInput}
              placeholder="E-mail"
            ></Input>
          </Layout>

          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setRestaurantName(text)}
              textStyle={styles.formInput}
              placeholder="Business name"
            ></Input>
          </Layout>

          <Layout style={styles.formInputContainer}>
            <Input
              multiline={true}
              onChangeText={(text) => setRestaurantAddress(text)}
              textStyle={styles.formMultiLineInput}
              placeholder="Business Address"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setContactNo(text)}
              textStyle={styles.formInput}
              placeholder="Contact No."
              size="large"
            ></Input>
          </Layout>

          <Layout style={styles.formInputContainer}>
            <Button size="large" status="info" onPress={handleChooseLogo}>
              UPLOAD RESTAURANT LOGO
            </Button>
          </Layout>
          {selectedLogo && (
            <Image style={styles.uploadedLogo} source={{ uri: selectedLogo }} />
          )}
          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status="success"
              onPress={handleSubmitRegistration}
            >
              SUBMIT
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
    </SimpleAnimation>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 3,
    marginTop: 15,
    width: "80%",
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
  uploadedLogo: {
    marginTop: 20,
    width: 100,
    height: 100,
  },
});

export default RegisterModal;
