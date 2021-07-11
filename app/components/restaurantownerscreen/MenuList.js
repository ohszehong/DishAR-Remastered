import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Layout,
  Text,
  Tab,
  TabBar,
  List,
  Card,
  Spinner,
} from "@ui-kitten/components";
import * as firebase from "firebase";
import { SharedElement } from "react-navigation-shared-element";

import EmptyListIcon from "../../icons/EmptyListIcon";
import MenuAPI from "../../api/shared/menu-caller";
import FoodAPI from "../../api/shared/food-caller";
import PriceIcon from "../../icons/PriceIcon";

class MenuList extends Component {
  constructor({ navigation, route, ...props }) {
    super();
    this.state = {
      restaurantOwnerData: route.params,
      foodItems: [],
      isLoading: false,
      foodThumbnailUrls: [],
      navigation: navigation,
      refreshing: false,
    };
  }

  renderItem = (foodData) => {
    const { foodThumbnailUrls, navigation, restaurantOwnerData } = this.state;

    let data = foodData.item;

    data.restaurantOwnerId = restaurantOwnerData._id;

    data.thumbnailUrl = foodThumbnailUrls[foodData.index];

    if (restaurantOwnerData.role === "customer") {
      data.role = "customer";
    }

    return (
      <Card
        style={styles.item}
        footer={(footerProps) => this.renderItemFooter(footerProps, foodData)}
        onPress={() => navigation.push("FoodDetails", { data })}
      >
        <SharedElement id={data._id}>
          <Image
            style={{
              marginVertical: -16,
              marginHorizontal: -24,
              height: 200,
              width: "120%",
            }}
            source={{ uri: data.thumbnailUrl }}
          />
        </SharedElement>
      </Card>
    );
  };

  renderItemFooter = (footerProps, foodData) => (
    <Layout {...footerProps}>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text category="h5">{foodData.item.foodName}</Text>
        <Layout style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            RM {foodData.item.foodPrice}
          </Text>
          <PriceIcon style={{ marginLeft: 8 }} />
        </Layout>
      </Layout>
    </Layout>
  );

  handleRefreshList = () => {
    const { restaurantOwnerData } = this.state;

    this.setState(
      {
        refreshing: true,
      },
      async () => {
        //refresh the list using startUp function
        await this.startUp(restaurantOwnerData);
      }
    );
  };

  getFoodThumbnailUrl = (filePath) => {
    let foodThumbnailUrls = this.state.foodThumbnailUrls;

    const storage = firebase.default.storage();
    const storageRef = storage.ref();
    const fileRef = storageRef.child(filePath);

    fileRef.getDownloadURL().then((url) => {
      foodThumbnailUrls.push(url);
      this.setState({ foodThumbnailUrls });
    });
  };

  startUp = async (restaurantOwnerData) => {
    this.setState({ isLoading: true });
    //fetch all the foods
    const responseRetrievingMenu = await MenuAPI.retrieveMenu({
      _id: restaurantOwnerData._id,
    });

    if (responseRetrievingMenu.success) {
      //loop through the food Ids and then retrieve food data and add to foodItems array
      let foodItems = [];

      let responses = await Promise.all(
        responseRetrievingMenu.data.menuItems.map(async (menuItem) => {
          let foodData = await FoodAPI.retrieveFood({ _id: menuItem });
          return foodData;
        })
      );

      if (responses.length > 0) {
        responses.map((response) => {
          if (response.success) {
            foodItems.push(response.data); //add food data to foodItems array

            this.getFoodThumbnailUrl(response.data.foodThumbnailFilePath);
          }
        });
      }

      this.setState({ foodItems });
    } else {
      console.log(
        "error retrieving menu: " + JSON.stringify(responseRetrievingMenu)
      );
    }

    this.setState({ refreshing: false, isLoading: false });
  };

  async componentDidMount() {
    this.setState({ isLoading: true });

    const { restaurantOwnerData } = this.state;

    await this.startUp(restaurantOwnerData);

    this.setState({ isLoading: false });
  }

  render() {
    const { restaurantOwnerData, refreshing, foodItems, isLoading } =
      this.state;

    return (
      <React.Fragment>
        <Layout
          level="2"
          style={
            isLoading
              ? {
                  justifyContent: "center",
                  alignItems: "center",
                  ...styles.rootContainer,
                }
              : styles.rootContainer
          }
        >
          <Layout
            style={
              isLoading
                ? {
                    position: "absolute",
                    margin: 25,
                    top: 0,
                  }
                : styles.topTabContainer
            }
          >
            <TabBar style={styles.topTab} selectedIndex={0}>
              <Tab
                style={{ flexDirection: "row" }}
                title={(evaProps) => (
                  <Text
                    {...evaProps}
                    style={{ paddingTop: 15, fontWeight: "bold", fontSize: 18 }}
                  >
                    {restaurantOwnerData.restaurant.restaurantName}
                  </Text>
                )}
              />
            </TabBar>
          </Layout>
          {isLoading ? (
            <Spinner status="success" size="giant" />
          ) : foodItems.length <= 0 ? (
            <TouchableOpacity onPress={() => this.startUp(restaurantOwnerData)}>
              <EmptyListIcon />
            </TouchableOpacity>
          ) : (
            <List
              style={styles.listContainer}
              data={foodItems}
              renderItem={this.renderItem}
              refreshing={refreshing}
              onRefresh={this.handleRefreshList}
            />
          )}
        </Layout>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 25,
    elevation: 5,
  },
  rootContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  topTab: {
    height: 50,
    alignSelf: "center",
    width: Dimensions.get("screen").width,
  },
  topTabContainer: { margin: 25, marginTop: 0 },
  listContainer: {
    maxHeight: Dimensions.get("screen").height - 50,
  },
});

export default MenuList;
