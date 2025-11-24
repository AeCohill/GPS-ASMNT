import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentPosition = await Location.getCurrentPositionAsync({});
      setLocation(currentPosition.coords);
    })();
  }, []);

  const nearbyRestaurant = location
    ? {
        latitude: location.latitude + 0.001, // small offset near user
        longitude: location.longitude + 0.001,
        title: "Nearby Restaurant",
      }
    : null;

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {nearbyRestaurant && (
            <Marker
              coordinate={{
                latitude: nearbyRestaurant.latitude,
                longitude: nearbyRestaurant.longitude,
              }}
              title={nearbyRestaurant.title}
              description="This restaurant is close to you!"
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.text}>
          {errorMsg ? errorMsg : "Finding your location..."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  text: { marginTop: 50, textAlign: "center", fontSize: 18 },
});
