import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { CommonActions } from "@react-navigation/native";

import RoAPI from "../api/restaurant-owner-caller";

function QRCodeScannerScreen({navigation, route}) {

    const handleReadQR = async (scannedData) => {

        //get restaurant owner data from here...
        const response = await RoAPI.getRestaurantOwner({_id: scannedData.data});

        //add role of customer to response.data 
        response.data.role = "customer";

        if(response.success) {

        navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "RestaurantOwner", data: response.data }],
            })
          );
        }
        else {
            console.log("error when scanning QR code:" + JSON.stringify(response.error));
        }
    }

    return (
       <QRCodeScanner 
       containerStyle={{backgroundColor: "#FFF", flex:1}}
       onRead={(restaurantOwnerId) => handleReadQR(restaurantOwnerId)} 
       reactivate={false} 
       permissionDialogMessage="Need Permission to Access Camera."
       showMarker={true}
       markerStyle={{borderColor: "#FFF", borderRadius: 10}}
       />
    );
}

export default QRCodeScannerScreen;