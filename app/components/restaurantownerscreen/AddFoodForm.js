import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import {
  Layout,
  Text,
  Input,
  Button,
  Spinner,
  Divider,
} from "@ui-kitten/components";
import { SimpleAnimation } from "react-native-simple-animations";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";

import PopUpMsg from "../reusable/PopUpMsg";
import colors from "../../config/colors";
import { inputRegexValidation } from "../../utilities/inputRegexes";
import RoAPI from "../../api/restaurant-owner-caller";

function AddFoodForm({ navigation, route }) {
  //restaurant owner data
  const restaurantOwnerData = route.params.data;

  //input data update
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState(0);
  const [foodObjFile, setFoodObjFile] = useState({
    fileName: null,
    fileUri: null,
  });
  const [foodMtlFile, setFoodMtlFile] = useState({
    fileName: null,
    fileUri: null,
  });
  const [foodTextureFile, setFoodTextureFile] = useState(null);
  const [foodThumbnailFile, setFoodThumbnailFile] = useState(null);
  const [foodCalories, setFoodCalories] = useState("");
  const [foodProtein, setFoodProtein] = useState("");
  const [foodCarbohydrates, setFoodCarbohydrates] = useState("");
  const [foodFat, setFoodFat] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [foodIngredients, setFoodIngredients] = useState("");

  //submission success signal
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //prompt confirm message signal
  const [promptConfirmMessage, setPromptConfirmMessage] = useState(false);

  //input error signal
  const [inputError, setInputError] = useState({
    errorField: null,
    errorMsg: null,
  });

  //loading signal
  const [isLoading, setIsLoading] = useState(null);

  const uploadAsset = async (uri, filePath) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    let ref = firebase.default.storage().ref().child(filePath);
    return ref.put(blob);
  };

  const writeToWorkspace = async (
    fileType,
    firebaseChildRef,
    foodTextureFileName
  ) => {
    //filepath for fs createWriteStream to write the file
    //here the workspace filepath is slightly different than the workspace filepath stored in the database
    //so it is best to recreate another variable for it

    let foodWorkspaceFilePath = null;
    const constantWorkspaceFilePath =
      "./app/assets/" + restaurantOwnerData._id + "/" + foodName + "/";

    const storage = firebase.default.storage();
    const storageRef = storage.ref();
    const fileRef = storageRef.child(firebaseChildRef);

    if (fileType === "obj") {
      foodWorkspaceFilePath = constantWorkspaceFilePath + foodObjFile.fileName;

      fileRef.getDownloadURL().then(async (url) => {
        console.log("download url: " + url);
        let response = await RoAPI.uploadFilesToWorkspace({
          foodObjWorkspaceFilePath: foodWorkspaceFilePath,
          foodObjFirebaseFileUrl: url,
          restaurantOwnerDirectory: constantWorkspaceFilePath,
        });
        if (response.success) {
          console.log("uploaded obj file successfully.");
        }
      });
    } else if (fileType === "mtl") {
      foodWorkspaceFilePath = constantWorkspaceFilePath + foodMtlFile.fileName;

      fileRef.getDownloadURL().then(async (url) => {
        console.log("download url: " + url);
        let response = await RoAPI.uploadFilesToWorkspace({
          foodObjWorkspaceFilePath: foodWorkspaceFilePath,
          foodObjFirebaseFileUrl: url,
          restaurantOwnerDirectory: constantWorkspaceFilePath,
        });
        if (response.success) {
          console.log("uploaded obj file successfully.");
        }
      });
    } else if (fileType === "texture") {
      foodWorkspaceFilePath = constantWorkspaceFilePath + foodTextureFileName;

      fileRef.getDownloadURL().then(async (url) => {
        console.log("download url: " + url);
        let response = await RoAPI.uploadFilesToWorkspace({
          foodObjWorkspaceFilePath: foodWorkspaceFilePath,
          foodObjFirebaseFileUrl: url,
          restaurantOwnerDirectory: constantWorkspaceFilePath,
        });
        if (response.success) {
          console.log("uploaded obj file successfully.");
        }
      });
    }

    //directory to store food obj, mtl and texture to the server
    // const restaurantOwnerDirectory =
    //       "./app/assets/" + restaurantOwnerId + "/" + "Teisyoku";
  };

  const handleChooseFoodObj = async () => {
    setIsLoading("foodObjFile");

    const options = {
      type: "application/octet-stream",
    };
    let result = await DocumentPicker.getDocumentAsync(options);

    if (result.type === "success") {
      let uri = result.uri;
      let fileName = result.name;
      let fileExtension = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (fileExtension != "obj") {
        console.log(fileExtension);
        setInputError({
          errorField: "foodObjFile",
          errorMsg: "Invalid file type, please upload .obj file.",
        });
        setFoodObjFile({ fileName: null, fileUri: null });
      } else {
        setFoodObjFile({ fileName: fileName, fileUri: uri });
        console.log("obj file uploaded: " + fileName);
        setInputError({ errorField: null, errorMsg: null });
      }
    }

    setIsLoading(null);
  };

  const handleChooseFoodMtl = async () => {
    setIsLoading("foodMtlFile");

    const options = {
      type: "application/octet-stream",
    };

    let result = await DocumentPicker.getDocumentAsync(options);

    if (result.type === "success") {
      let uri = result.uri;
      let fileName = result.name;
      let fileExtension = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (fileExtension != "mtl") {
        setInputError({
          errorField: "foodMtlFile",
          errorMsg: "Invalid file type, please upload .mtl file.",
        });
        setFoodMtlFile({ fileName: null, fileUri: null });
      } else {
        setFoodMtlFile({ fileName: fileName, fileUri: uri });
        console.log("mtl file uploaded: " + fileName);
        setInputError({ errorField: null, errorMsg: null });
      }
    }

    setIsLoading(null);
  };

  const handleChooseFoodTexture = async () => {
    const options = {
      mediaType: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      setFoodTextureFile(result.uri);
    }
  };

  const handleChooseFoodThumbnail = async () => {
    const options = {
      mediaType: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      setFoodThumbnailFile(result.uri);
    }
  };

  const validateFormData = () => {
    var validate = false;

    if (foodName.trim() === "") {
      setInputError({
        errorField: "foodName",
        errorMsg: "food name cannot be emtpy.",
      });
    } else if (foodPrice.trim() === "") {
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
    } else if (foodObjFile.fileUri === null) {
      setInputError({
        errorField: "foodObjFile",
        errorMsg: "Missing .obj file.",
      });
    } else if (foodMtlFile.fileUri === null) {
      setInputError({
        errorField: "foodMtlFile",
        errorMsg: "Missing .mtl file.",
      });
    } else if (foodTextureFile === null) {
      setInputError({
        errorField: "foodTextureFile",
        errorMsg: "Missing texture file.",
      });
    } else if (foodThumbnailFile === null) {
      setInputError({
        errorField: "foodThumbnailFile",
        errorMsg: "Missing thumbnail file.",
      });
    } else {
      setInputError({ errorField: null, errorMsg: null });
      validate = true;
    }
    return validate;
  };

  const handleSubmitAddFood = async () => {
    setIsLoading("addFood");

    //close the confirm message
    setPromptConfirmMessage(false);

    const validateInput = validateFormData();

    if (validateInput) {
      const restaurantOwnerId = restaurantOwnerData._id;

      const foodTextureFileExtension = foodTextureFile.substr(
        foodTextureFile.lastIndexOf(".") + 1
      );
      const foodThumbnailFileExtension = foodThumbnailFile.substr(
        foodThumbnailFile.lastIndexOf(".") + 1
      );

      /* ---------------------- generate resources filepath for firebase -------------------------*/
      let foodThumbnailFilePath =
        restaurantOwnerId +
        "/" +
        foodName +
        "/" +
        foodName +
        "Thumbnail." +
        foodThumbnailFileExtension;

      //the mtl, obj and texture file should set to have same name (user need to link the obj and mtl by themselves)
      let foodObjFileNameWithoutExtension = foodObjFile.fileName.replace(
        /\.[^/.]+$/,
        ""
      );
      let foodTextureFirebaseFilePath =
        restaurantOwnerId +
        "/" +
        foodName +
        "/" +
        foodObjFileNameWithoutExtension +
        "." +
        foodTextureFileExtension;

      let foodObjFirebaseFilePath =
        restaurantOwnerId + "/" + foodName + "/" + foodObjFile.fileName;
      let foodMtlFirebaseFilePath =
        restaurantOwnerId + "/" + foodName + "/" + foodMtlFile.fileName;

      /* ----------------- resources filepath to store in database (should point to workspace directory instead) ----------------*/
      let foodTextureFileName =
        foodObjFileNameWithoutExtension + "." + foodTextureFileExtension;

      let foodObjWorkspaceFilePath =
        "./../assets/" +
        restaurantOwnerId +
        "/" +
        foodName +
        "/" +
        foodObjFile.fileName;
      let foodMtlWorkspaceFilePath =
        "./../assets/" +
        restaurantOwnerId +
        "/" +
        foodName +
        "/" +
        foodMtlFile.fileName;
      let foodTextureWorkspaceFilePath =
        "./../assets/" +
        restaurantOwnerId +
        "/" +
        foodName +
        "/" +
        foodTextureFileName;

      let data = {
        restaurantOwnerId: restaurantOwnerData._id,
        foodName: foodName,
        foodPrice: foodPrice,
        foodModelAssets: {
          foodObjFirebaseFilePath: foodObjFirebaseFilePath,
          foodObjWorkspaceFilePath: foodObjWorkspaceFilePath,
          foodMtlFirebaseFilePath: foodMtlFirebaseFilePath,
          foodMtlWorkspaceFilePath: foodMtlWorkspaceFilePath,
          foodTextureFirebaseFilePath: foodTextureFirebaseFilePath,
          foodTextureWorkspaceFilePath: foodTextureWorkspaceFilePath,
        },
        foodThumbnailFilePath: foodThumbnailFilePath,
        foodNutritionalFacts: {
          foodCalories: foodCalories,
          foodProtein: foodProtein,
          foodCarbohydrates: foodCarbohydrates,
          foodFat: foodFat,
        },
        foodDesc: foodDesc,
        foodIngredients: foodIngredients,
      };

      const response = await RoAPI.addFoodToMenu(data);
      if (response.success) {
        //upload files to firebase storage first
        await uploadAsset(foodObjFile.fileUri, foodObjFirebaseFilePath);
        await uploadAsset(foodMtlFile.fileUri, foodMtlFirebaseFilePath);
        await uploadAsset(foodTextureFile, foodTextureFirebaseFilePath);
        await uploadAsset(foodThumbnailFile, foodThumbnailFilePath);

        //after uploaded the files, write those files to the server/workspace
        await writeToWorkspace("obj", foodObjFirebaseFilePath);
        await writeToWorkspace("mtl", foodMtlFirebaseFilePath);
        await writeToWorkspace(
          "texture",
          foodTextureFirebaseFilePath,
          foodTextureFileName
        );

        setSubmitSuccess(true);
      } else {
        if (foodName === response.error.keyValue.foodName) {
          setInputError({
            errorField: "foodName",
            errorMsg: "Same food name exists in the menu.",
          });
        }
      }
    }

    setIsLoading(null);
  };

  return (
    <SimpleAnimation
      direction="up"
      movementType="slide"
      duration={2000}
      distance={400}
      style={styles.rootContainer}
    >
      <Layout level="2" style={styles.registerForm}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <Text category="h5">FOOD DETAILS</Text>
          <Divider style={styles.divider} />
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setFoodName(text)}
              status={inputError.errorField === "foodName" && "danger"}
              textStyle={styles.formInput}
              placeholder="Food Name e.g. Fried Rice"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              onChangeText={(text) => setFoodPrice(text)}
              status={inputError.errorField === "foodPrice" && "danger"}
              textStyle={styles.formInput}
              placeholder="Food Price e.g. 15"
            ></Input>
          </Layout>

          {foodObjFile.fileUri && (
            <Text style={{ ...styles.errorMsg, color: colors.primary }}>
              {foodObjFile.fileName}
            </Text>
          )}
          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status={
                inputError.errorField === "foodObjFile"
                  ? "danger"
                  : foodObjFile.fileUri
                  ? "success"
                  : "warning"
              }
              onPress={handleChooseFoodObj}
            >
              {isLoading === "foodObjFile" ? (
                <Spinner status="control" />
              ) : (
                "UPLOAD FOOD .OBJ FILE"
              )}
            </Button>
          </Layout>

          {foodMtlFile.fileUri && (
            <Text style={{ ...styles.errorMsg, color: colors.primary }}>
              {foodMtlFile.fileName}
            </Text>
          )}
          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status={
                inputError.errorField === "foodMtlFile"
                  ? "danger"
                  : foodMtlFile.fileUri
                  ? "success"
                  : "warning"
              }
              onPress={handleChooseFoodMtl}
            >
              {isLoading === "foodMtlFile" ? (
                <Spinner status="control" />
              ) : (
                "UPLOAD FOOD .MTL FILE"
              )}
            </Button>
          </Layout>

          {foodTextureFile && (
            <Image
              style={styles.uploadedImage}
              source={{ uri: foodTextureFile }}
            />
          )}

          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status={foodTextureFile ? "success" : "warning"}
              onPress={handleChooseFoodTexture}
            >
              {isLoading === "foodTextureFile" ? (
                <Spinner status="control" />
              ) : (
                "UPLOAD FOOD TEXTURE FILE"
              )}
            </Button>
          </Layout>

          {foodThumbnailFile && (
            <Image
              style={styles.uploadedImage}
              source={{ uri: foodThumbnailFile }}
            />
          )}

          <Layout style={styles.formInputContainer}>
            <Button
              size="large"
              status={foodThumbnailFile ? "success" : "warning"}
              onPress={handleChooseFoodThumbnail}
            >
              {isLoading === "foodThumbnailFile" ? (
                <Spinner status="control" />
              ) : (
                "UPLOAD FOOD THUMBNAIL"
              )}
            </Button>
          </Layout>

          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "foodCalories" && "danger"}
              multiline={true}
              onChangeText={(text) => setFoodCalories(text)}
              textStyle={styles.formMultiLineInput}
              placeholder="Food Calories e.g. (kcal) 560"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "foodProtein" && "danger"}
              onChangeText={(text) => setFoodProtein(text)}
              textStyle={styles.formInput}
              placeholder="Food Protein (g) e.g. 23"
              size="large"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "foodCarbohydrates" && "danger"}
              onChangeText={(text) => setFoodCarbohydrates(text)}
              textStyle={styles.formInput}
              placeholder="Food Carbohydrates (g) e.g. 56"
              size="large"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "foodFat" && "danger"}
              onChangeText={(text) => setFoodFat(text)}
              textStyle={styles.formInput}
              placeholder="Food Fat (g) e.g. 16"
              size="large"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "foodDesc" && "danger"}
              onChangeText={(text) => setFoodDesc(text)}
              textStyle={styles.formInput}
              placeholder="Food Description"
              size="large"
            ></Input>
          </Layout>
          <Layout style={styles.formInputContainer}>
            <Input
              status={inputError.errorField === "foodIngredients" && "danger"}
              onChangeText={(text) => setFoodIngredients(text)}
              textStyle={{ ...styles.formInput, height: 50 }}
              multiline={true}
              placeholder="Food Ingredients e.g. rice, salt, pepper... (optional)"
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
              onPress={() => setPromptConfirmMessage(true)}
            >
              {isLoading === "addFood" ? <Spinner status="control" /> : "ADD"}
            </Button>
          </Layout>

          <Layout
            style={{
              ...styles.formInputContainer,
              height: 25,
              marginBottom: 50,
            }}
          ></Layout>
        </ScrollView>
      </Layout>

      <PopUpMsg
        promptConfirmMsg={promptConfirmMessage}
        onPressConfirm={handleSubmitAddFood}
        onPressCancelConfirm={() => setPromptConfirmMessage(false)}
        confirmMsg={
          "Please ensure that the .obj, .mtl and texture file has the same name and are mapped correctly before upload!"
        }
        visible={submitSuccess}
        success={submitSuccess}
        text={"Successfully Added food to the menu."}
        onPress={() => setSubmitSuccess(false)}
      />
    </SimpleAnimation>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
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
  uploadedImage: {
    marginTop: 20,
    width: "90%",
    height: 200,
  },
});

export default AddFoodForm;
