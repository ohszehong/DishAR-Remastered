import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  View,
} from "react-native";
import {
  Text,
  Layout,
  Tab,
  TabBar,
  Card,
  Button,
  Spinner,
} from "@ui-kitten/components";
import { Badge } from "react-native-elements";

import colors from "../config/colors";
import RoAPI from "./../api/restaurant-owner-caller";
import AdminAPI from "./../api/admin-caller";
import PopUpMsg from "../components/reusable/PopUpMsg";
import EmptyListIcon from "../icons/EmptyListIcon";
import { BackHandler } from "react-native";

const Header = (props, firstName, lastName, restaurantName) => (
  <View {...props}>
    <Text category="h5">{restaurantName}</Text>
    <Text category="s1">from {firstName + " " + lastName}</Text>
  </View>
);

const Footer = (props, onPressAccept, onPressReject) => (
  <View {...props} style={[props.style, styles.footerContainer]}>
    <Button
      style={styles.footerControl}
      size="medium"
      status="danger"
      onPress={onPressReject}
    >
      REJECT
    </Button>
    <Button style={styles.footerControl} size="medium" onPress={onPressAccept}>
      ACCEPT
    </Button>
  </View>
);

class PendingRoRegistrationCard extends Component {
  constructor(props) {
    super();
  }

  render() {
    const { restaurantOwner, onPressAccept, onPressReject } = this.props;

    const firstName = restaurantOwner.firstName;
    const lastName = restaurantOwner.lastName;
    const restaurantName = restaurantOwner.restaurant.restaurantName;

    return (
      <Card
        status="success"
        style={styles.card}
        header={(props) => Header(props, firstName, lastName, restaurantName)}
        footer={(props) => Footer(props, onPressAccept, onPressReject)}
        key={restaurantOwner._id}
      >
        <Text category="p1">
          <Text category="h6">Email: </Text>
          {restaurantOwner.email}
        </Text>
        <Text>
          <Text category="h6">Address: </Text>
          {restaurantOwner.restaurant.restaurantAddress}
        </Text>
        <Text>
          <Text category="h6">Contact No: </Text>
          {restaurantOwner.contactNo}
        </Text>
      </Card>
    );
  }
}

class AdminHomeScreen extends Component {
  constructor({ navigation, route }) {
    super();
    this.state = {
      adminData: route.data,
      selectedIndex: 0,
      pendingRO: [],
      pendingCount: 0,
      approvedSignal: null,
      actionSignal: null,
      msgBoxMsg: "",
      isLoading: false,
      isModalOpen: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    //get all pending restaurant owner records
    const response = await RoAPI.getPendingRO();

    if (response.success) {
      this.setState({
        pendingRO: response.data,
        pendingCount: response.data.length,
        isLoading: false,
      });
    }
  }

  async componentDidUpdate() {
    let { approvedSignal, isModalOpen } = this.state;

    //get all pending restaurant owner records
    if (approvedSignal != null && !isModalOpen) {
      const response = await RoAPI.getPendingRO();

      console.log("trigger update");

      if (response.success) {
        console.log("trigger success");
        this.setState({
          pendingRO: response.data,
          pendingCount: response.data.length,
          approvedSignal: null,
        });
      }
    }
  }

  handleAcceptRegistration = async (restaurantOwnerId) => {
    //set restaurant owner isApproved to true
    const response = await AdminAPI.approveRO({ _id: restaurantOwnerId });

    if (response.success) {
      this.setState({
        approvedSignal: true,
        msgBoxMsg: response.msg,
        isModalOpen: true,
      });
    } else {
      console.log("error: " + response.error);
    }
  };

  handleRejectRegistration = async (restaurantOwnerId) => {
    //delete restaurant owner record from database
    const response = await AdminAPI.rejectRO({ _id: restaurantOwnerId });

    if (response.success) {
      this.setState({
        approvedSignal: false,
        msgBoxMsg: response.msg,
        isModalOpen: true,
      });
    } else {
      console.log("error: " + response.error);
    }
  };

  handleClosePopUpMsgBox = () => {
    this.setState({
      msgBoxMsg: "",
      isModalOpen: false,
    });
  };

  render() {
    const {
      pendingRO,
      pendingCount,
      msgBoxMsg,
      approvedSignal,
      isLoading,
      isModalOpen,
    } = this.state;

    return (
      <Layout
        style={isLoading ? styles.loadingRootContainer : styles.rootContainer}
      >
        {isLoading ? (
          <Spinner status="success" size="large" />
        ) : (
          <React.Fragment>
            <Layout style={styles.topTabContainer}>
              <TabBar style={styles.topTab} selectedIndex={0}>
                <Tab
                  style={{ flexDirection: "row" }}
                  title={(evaProps) => (
                    <React.Fragment>
                      <Text
                        {...evaProps}
                        style={{ fontSize: 16, paddingTop: 15 }}
                      >
                        REGISTRATION REQUESTS
                        {"  "}
                      </Text>
                      <Badge
                        badgeStyle={{
                          width: 32,
                          height: 32,
                          borderRadius: 45,
                        }}
                        containerStyle={{ paddingTop: 10 }}
                        value={pendingCount}
                        status="success"
                      />
                    </React.Fragment>
                  )}
                />
              </TabBar>
            </Layout>

            <Layout level="3" style={styles.cardListContainer}>
              <ScrollView style={styles.scrollView}>
                {
                  //if list is empty
                  pendingRO.length <= 0 && <EmptyListIcon />
                }

                {pendingRO.map((restaurantOwner) => (
                  <PendingRoRegistrationCard
                    restaurantOwner={restaurantOwner}
                    onPressAccept={() =>
                      this.handleAcceptRegistration(restaurantOwner._id)
                    }
                    onPressReject={() =>
                      this.handleRejectRegistration(restaurantOwner._id)
                    }
                    key={restaurantOwner._id}
                  />
                ))}
              </ScrollView>
            </Layout>
            <PopUpMsg
              visible={isModalOpen}
              success={approvedSignal}
              text={msgBoxMsg}
              onPress={this.handleClosePopUpMsgBox}
            />
          </React.Fragment>
        )}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  cardListContainer: {
    flex: 1,
    padding: 25,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginBottom: 15,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerControl: {
    marginHorizontal: 3,
  },
  rootContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  loadingRootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  topTab: {
    height: 70,
    alignSelf: "center",
    width: Dimensions.get("screen").width,
  },
  topTabContainer: {
    margin: 25,
    marginTop: 0,
  },
});

export default AdminHomeScreen;
